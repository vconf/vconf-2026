<script setup lang="ts">
import {
  useDocumentVisibility,
  useElementSize,
  useIntersectionObserver,
  usePreferredReducedMotion,
} from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    /** card：講者卡片的直式版位；circle：議程列表的圓形頭像（會裁掉下半身） */
    variant?: 'card' | 'circle'
    /**
     * 配色方案：
     * - `mist`：purple-ultralight 底板 + 純紫粒子，版位邊界最清楚
     * - `snow`：白底 + hairline 外框，粒子往下淡出，剪影像浮在背景裡
     * - `duo`：白到淡紫的漸層底，肩線附近混入主色綠
     */
    tone?: 'mist' | 'snow' | 'duo'
  }>(),
  { variant: 'card', tone: 'mist' },
)

/**
 * 剪影輪廓：頭 + 肩線的半身像，座標系固定 100×140。
 */
const SILHOUETTE = { width: 100, height: 140 } as const
const SILHOUETTE_PATH
  = 'M50 12C61.6 12 71 22.1 71 34.5S61.6 57 50 57 29 46.9 29 34.5 38.4 12 50 12Z'
    + 'M50 62c18.4 0 32.6 10.4 37.6 27.2 3.3 11.1 4.9 28.4 4.9 50.8H7.5c0-22.4 1.6-39.7 4.9-50.8C17.4 72.4 31.6 62 50 62Z'

/** 粒子上限：卡片尺寸變大時改用較疏的取樣間距，避免每幀成本失控 */
const MAX_PARTICLES = 700
const ALPHA_STEPS = 6
const TAU = Math.PI * 2

/**
 * 三種配色方案。
 * `plate` 是底板樣式（元件自己帶，呼叫端不用再給背景）；
 * `accent` 是主色綠的比例，只作用在肩線以下；`fade` 是往下淡出的強度。
 */
const TONE_STYLE = {
  mist: {
    plate: 'bg-vconf-purple-ultralight',
    accent: 0,
    fade: 0,
  },
  snow: {
    plate: 'bg-vconf-white ring-1 ring-inset ring-vconf-gray-exlight',
    accent: 0,
    fade: 0.6,
  },
  duo: {
    plate: 'bg-gradient-to-b from-vconf-white to-vconf-purple-ultralight',
    accent: 0.3,
    fade: 0.2,
  },
} as const

/** 各版位的取樣密度與抖動幅度（單位都是 CSS px） */
const VARIANT_STYLE = {
  card: { divisor: 26, minGap: 4.5, maxGap: 8, radius: 1.15, wobble: 2.4 },
  circle: { divisor: 24, minGap: 2.6, maxGap: 4.4, radius: 0.85, wobble: 1.4 },
} as const

interface Particle {
  /** 基準座標，device px */
  x: number
  y: number
  phase: number
  speed: number
  ampX: number
  ampY: number
  alpha: number
  radius: number
  /** 少數粒子用主色點綴，其餘用紫色 */
  accent: boolean
}

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const { width, height } = useElementSize(rootRef)
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'
const documentVisibility = useDocumentVisibility() // 'visible' | 'hidden'
const isInViewport = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let fillStyles: string[] = []
let buckets: number[][] = []
let frameId: number | null = null

useIntersectionObserver(
  rootRef,
  ([entry]) => {
    isInViewport.value = entry?.isIntersecting ?? false
  },
  { threshold: 0 },
)

/** 從 CSS 變數取色，維持與主題一致（值是 `H S% L%` 這種 hsl 片段） */
function readColorToken(name: string, fallback: string) {
  const element = rootRef.value

  if (!element)
    return fallback

  return getComputedStyle(element).getPropertyValue(name).trim() || fallback
}

function buildFillStyles() {
  const purple = readColorToken('--color-purple', '263 100% 62%')
  const primary = readColorToken('--color-primary', '153 48% 49%')

  fillStyles = [purple, primary].flatMap(color =>
    Array.from({ length: ALPHA_STEPS }, (_, step) => {
      const alpha = (step + 1) / ALPHA_STEPS

      return `hsla(${color} / ${alpha.toFixed(2)})`
    }),
  )
  buckets = fillStyles.map(() => [])
}

/** 把 100×140 的剪影擺進實際版位：card 置中撐滿高度，circle 放大到只留頭與肩 */
function silhouetteTransform(w: number, h: number) {
  if (props.variant === 'circle') {
    const scale = (w / 85) * 1.02

    return {
      scale,
      x: (w - SILHOUETTE.width * scale) / 2,
      // 頭部中心對到版位 42% 高，下半身交給外層的圓形裁切
      y: h * 0.42 - 34.5 * scale,
    }
  }

  const scale = Math.min(w / SILHOUETTE.width, h / SILHOUETTE.height) * 0.94

  return {
    scale,
    x: (w - SILHOUETTE.width * scale) / 2,
    y: h - SILHOUETTE.height * scale,
  }
}

/**
 * 在剪影範圍內以網格取樣產生粒子。
 * 取樣用 Path2D + isPointInPath，座標一律 device px，畫的時候就不用再換算。
 */
function buildParticles(w: number, h: number, dpr: number) {
  if (!ctx)
    return

  const style = VARIANT_STYLE[props.variant]
  const tone = TONE_STYLE[props.tone]
  const transform = silhouetteTransform(w, h)
  const path = new Path2D()

  path.addPath(
    new Path2D(SILHOUETTE_PATH),
    new DOMMatrix([
      transform.scale * dpr,
      0,
      0,
      transform.scale * dpr,
      transform.x * dpr,
      transform.y * dpr,
    ]),
  )

  let gap = Math.min(
    Math.max(Math.min(w, h) / style.divisor, style.minGap),
    style.maxGap,
  )

  // 取樣太密就放寬間距重來，維持每幀成本穩定
  for (let attempt = 0; attempt < 6; attempt++) {
    const sampled: Particle[] = []

    for (let y = gap / 2; y < h; y += gap) {
      for (let x = gap / 2; x < w; x += gap) {
        // 網格加一點抖動，粒子才不會排成明顯的格線
        const jitterX = x + (Math.random() - 0.5) * gap * 0.7
        const jitterY = y + (Math.random() - 0.5) * gap * 0.7

        if (!ctx.isPointInPath(path, jitterX * dpr, jitterY * dpr))
          continue

        // 越靠下越淡，讓剪影在沒有底板時能溶進背景
        const yNorm = jitterY / h
        const fade = 1 - tone.fade * yNorm ** 1.6

        sampled.push({
          x: jitterX * dpr,
          y: jitterY * dpr,
          phase: Math.random() * TAU,
          speed: 0.5 + Math.random() * 0.7,
          ampX: (0.35 + Math.random() * 0.65) * style.wobble * dpr,
          ampY: (0.35 + Math.random() * 0.65) * style.wobble * dpr,
          alpha: (0.28 + Math.random() * 0.42) * fade,
          radius: style.radius * (0.7 + Math.random() * 0.6) * dpr,
          accent: yNorm > 0.55 && Math.random() < tone.accent,
        })
      }
    }

    particles = sampled

    if (sampled.length <= MAX_PARTICLES)
      break

    gap *= 1.18
  }
}

function render(seconds: number) {
  const canvas = canvasRef.value

  if (!ctx || !canvas)
    return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const bucket of buckets) bucket.length = 0

  for (const particle of particles) {
    const wobble = Math.sin(seconds * particle.speed + particle.phase)
    const x = particle.x + wobble * particle.ampX
    const y
      = particle.y
        + Math.cos(seconds * particle.speed * 0.85 + particle.phase)
        * particle.ampY
    // 由上往下掃過的微光，讓剪影看起來還在成形
    const shimmer = Math.sin(seconds * 0.9 - particle.y * 0.012)
    const alpha = particle.alpha + shimmer * 0.22 + wobble * 0.08
    const step = Math.min(
      ALPHA_STEPS - 1,
      Math.max(0, Math.round(alpha * ALPHA_STEPS) - 1),
    )
    const bucket = buckets[particle.accent ? ALPHA_STEPS + step : step]

    bucket?.push(x, y, particle.radius)
  }

  for (let index = 0; index < buckets.length; index++) {
    const bucket = buckets[index]

    if (!bucket?.length)
      continue

    ctx.fillStyle = fillStyles[index] as string
    ctx.beginPath()

    for (let i = 0; i < bucket.length; i += 3) {
      const x = bucket[i] as number
      const y = bucket[i + 1] as number
      const radius = bucket[i + 2] as number

      ctx.moveTo(x + radius, y)
      ctx.arc(x, y, radius, 0, TAU)
    }

    ctx.fill()
  }
}

function stopLoop() {
  if (frameId === null)
    return

  cancelAnimationFrame(frameId)
  frameId = null
}

function startLoop() {
  if (frameId !== null || !particles.length)
    return

  const loop = (timestamp: number) => {
    render(timestamp / 1000)
    frameId = requestAnimationFrame(loop)
  }

  frameId = requestAnimationFrame(loop)
}

/** 只有在畫面內、分頁在前景、又沒要求減少動態時才跑 rAF */
function syncPlayState() {
  if (reducedMotion.value === 'reduce') {
    stopLoop()
    render(0)

    return
  }

  if (isInViewport.value && documentVisibility.value !== 'hidden')
    startLoop()
  else stopLoop()
}

function resize() {
  const canvas = canvasRef.value
  const w = width.value
  const h = height.value

  if (!canvas || w < 1 || h < 1)
    return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx = canvas.getContext('2d')

  if (!ctx)
    return

  buildFillStyles()
  buildParticles(w, h, dpr)
  // 重建完先畫一張靜態的，避免暫停狀態下版位是空的
  render(0)
  syncPlayState()
}

watch([width, height], resize)
watch(() => [props.variant, props.tone], resize)
watch([isInViewport, documentVisibility, reducedMotion], syncPlayState)

onMounted(resize)
onBeforeUnmount(stopLoop)
</script>

<template>
  <div
    ref="rootRef"
    class="relative"
    :class="TONE_STYLE[tone].plate"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0 block size-full"
      aria-hidden="true"
    ></canvas>
  </div>
</template>
