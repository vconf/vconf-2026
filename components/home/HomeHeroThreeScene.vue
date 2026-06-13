<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{
  sceneClass?: string
}>(), {
  sceneClass: 'w-full',
})

// ── Colour / opacity tables ───────────────────────────────────────────────────
const rightLayerColors = [
  '#FFFFFF',
  '#FCDFEC',
  '#FABFD9',
  '#F79FC6',
  '#F57EB2',
  '#F25E9F',
  '#F03E8C',
  '#ED1E79',
  '#EF3C6C',
  '#F15960',
  '#F37753',
  '#F69547',
  '#F8B33A',
  '#FAD02E',
  '#FCEE21',
]
const rightLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 71, 63, 54, 46, 37, 29, 20].map(v => v / 100)

const leftLayerColors = [
  '#687A89',
  '#5F8196',
  '#5688A2',
  '#4D8FAF',
  '#4496BC',
  '#3B9DC9',
  '#32A4D5',
  '#29ABE2',
  '#2CADD4',
  '#30AFC7',
  '#33B1B9',
  '#37B2AC',
  '#3AB49E',
  '#3EB691',
  '#41B883',
]
const leftLayerOpacities = [0, 11, 23, 34, 46, 57, 69, 80, 73, 66, 59, 51, 44, 37, 30].map(v => v / 100)

const layerCount = rightLayerColors.length
const layers = Array.from({ length: layerCount }, (_, i) => i)
const RAD_TO_DEG = 180 / Math.PI

// ── SVG tile geometry ─────────────────────────────────────────────────────────
const TILE = 228
const TILE_RX = 12
const leftDesktopScale = 1.14
const rightDesktopScale = 1.14
const leftDesktopOffset = { x: 33, y: 21 }
const rightDesktopOffset = { x: -14, y: -40 }

const leftPos = [
  { cx: 165, cy: 1215 },
  { cx: 190, cy: 1174 },
  { cx: 210, cy: 1111 },
  { cx: 240, cy: 1021 },
  { cx: 281, cy: 905 },
  { cx: 430, cy: 796 },
  { cx: 453, cy: 757 },
  { cx: 501, cy: 751 },
  { cx: 481, cy: 757 },
  { cx: 512, cy: 752 },
  { cx: 573, cy: 760 },
  { cx: 708, cy: 734 },
  { cx: 767, cy: 730 },
  { cx: 792, cy: 725 },
  { cx: 825, cy: 725 },
]
const rightPos = [
  { cx: 1120, cy: 580 },
  { cx: 1173, cy: 528 },
  { cx: 1200, cy: 503 },
  { cx: 1245, cy: 479 },
  { cx: 1299, cy: 453 },
  { cx: 1360, cy: 431 },
  { cx: 1421, cy: 423 },
  { cx: 1476, cy: 443 },
  { cx: 1564, cy: 472 },
  { cx: 1648, cy: 437 },
  { cx: 1715, cy: 385 },
  { cx: 1772, cy: 331 },
  { cx: 1817, cy: 277 },
  { cx: 1856, cy: 243 },
  { cx: 1911, cy: 279 },
]

const leftZDeg = [26, 28, 32, 37, 42, 48, 54, 55, 50, 45, 41, 38, 35, 32, 30]
const rightZDeg = [30, 33, 37, 42, 47, 52, 57, 30, 10, 14, 20, 23, 26, 28, 30]

// ── Wind sway params ──────────────────────────────────────────────────────────
const leftWindParams = layers.map((_, i) => ({
  amp: 0.018 + (i % 4) * 0.006,
  freq: 0.28 + (i % 5) * 0.09,
  phase: (i / layerCount) * Math.PI * 2.4,
}))
const rightWindParams = layers.map((_, i) => ({
  amp: 0.016 + (i % 4) * 0.006,
  freq: 0.30 + (i % 5) * 0.08,
  phase: (i / layerCount) * Math.PI * 2.1 + 1.2,
}))

const FALL_END = 0.3 + 14 * 0.09 + 0.09 + 14 * 0.09 + 0.48
const WIND_FADE_DURATION = 1.5

// ── Domino animation state ────────────────────────────────────────────────────
const dominoPlayed = useState('hero-domino-played', () => false)

const leftAnimDeg = leftZDeg.map(a => ({ deg: dominoPlayed.value ? a : 90 }))
const rightAnimDeg = rightZDeg.map(a => ({ deg: dominoPlayed.value ? a : 90 }))

// Pre-computed initial SVG transforms (prevents 1-frame position flash)
const leftInitialTransforms = layers.map(i =>
  `translate(${leftPos[i].cx + leftDesktopOffset.x},${leftPos[i].cy + leftDesktopOffset.y}) rotate(${leftAnimDeg[i].deg}) scale(${leftDesktopScale})`,
)
const rightInitialTransforms = layers.map(i =>
  `translate(${rightPos[i].cx + rightDesktopOffset.x},${rightPos[i].cy + rightDesktopOffset.y}) rotate(${rightAnimDeg[i].deg}) scale(${rightDesktopScale})`,
)

// ── SVG refs ──────────────────────────────────────────────────────────────────
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgDotsRef = ref<SVGImageElement | null>(null)
const svgBgRef = ref<SVGImageElement | null>(null)
let bgDotsRO: ResizeObserver | null = null
const leftTileRefs = shallowRef<Array<SVGGElement | null>>([])
const rightTileRefs = shallowRef<Array<SVGGElement | null>>([])

function setLeftTileRef(el: unknown, i: number) {
  leftTileRefs.value[i] = el as SVGGElement | null
}
function setRightTileRef(el: unknown, i: number) {
  rightTileRefs.value[i] = el as SVGGElement | null
}

// 點陣圖頂端距 SVG 底部的固定 CSS px；數值越小 → 位置越低（越靠近 SVG 底部）
// 325 ≈ 等同原本 y="760" 在 1440px viewport 的視覺位置
const DOTS_OFFSET_PX = 460

function updateBgDotsSize() {
  if (!heroSvgRef.value || !svgBgDotsRef.value)
    return
  const w = heroSvgRef.value.getBoundingClientRect().width
  if (w <= 0)
    return
  const s = w / 1494
  svgBgDotsRef.value.setAttribute('y', String(Math.round(1099 - DOTS_OFFSET_PX / s)))
  svgBgDotsRef.value.setAttribute('width', String(1478 / s))
  svgBgDotsRef.value.setAttribute('height', String(707 / s))
}

// ── Domino trigger ────────────────────────────────────────────────────────────
function startDominoAnimation() {
  if (dominoPlayed.value)
    return
  dominoPlayed.value = true
  const { gsap } = useGsap()
  if (!gsap)
    return
  const stagger = 0.09
  const dur = 0.48
  const leftEnd = 0.3 + (layerCount - 1) * stagger

  leftAnimDeg.forEach((s, i) =>
    gsap.to(s, { deg: leftZDeg[i], duration: dur, delay: 0.3 + i * stagger, ease: 'power4.out' }))
  rightAnimDeg.forEach((s, i) =>
    gsap.to(s, { deg: rightZDeg[i], duration: dur, delay: leftEnd + stagger + i * stagger, ease: 'power4.out' }))
}

// ── RAF loop ──────────────────────────────────────────────────────────────────
let rafId: number | null = null
let elapsed = dominoPlayed.value ? FALL_END + WIND_FADE_DURATION : 0
let ready = false
let frameCount = 0
let prevTs: number | null = null

function svgTick(ts: number) {
  const dt = prevTs ? (ts - prevTs) / 1000 : 0.016
  prevTs = ts
  elapsed += dt
  const windStrength = Math.max(0, Math.min(1, (elapsed - FALL_END) / WIND_FADE_DURATION))

  leftTileRefs.value.forEach((el, i) => {
    if (!el)
      return
    const w = leftWindParams[i]
    const wind = windStrength * Math.sin(elapsed * w.freq * Math.PI * 2 + w.phase) * w.amp * RAD_TO_DEG
    el.setAttribute(
      'transform',
      `translate(${leftPos[i].cx + leftDesktopOffset.x},${leftPos[i].cy + leftDesktopOffset.y}) rotate(${leftAnimDeg[i].deg + wind}) scale(${leftDesktopScale})`,
    )
  })

  rightTileRefs.value.forEach((el, i) => {
    if (!el)
      return
    const w = rightWindParams[i]
    const wind = windStrength * Math.sin(elapsed * w.freq * Math.PI * 2 + w.phase) * w.amp * RAD_TO_DEG
    el.setAttribute(
      'transform',
      `translate(${rightPos[i].cx + rightDesktopOffset.x},${rightPos[i].cy + rightDesktopOffset.y}) rotate(${rightAnimDeg[i].deg + wind}) scale(${rightDesktopScale})`,
    )
  })

  if (!ready) {
    frameCount++
    if (frameCount > 3) {
      const allReady = leftTileRefs.value.filter(Boolean).length === layerCount
        && rightTileRefs.value.filter(Boolean).length === layerCount
      if (allReady) {
        ready = true
        startDominoAnimation()
      }
    }
  }
  rafId = requestAnimationFrame(svgTick)
}

// ── onMounted ─────────────────────────────────────────────────────────────────
onMounted(() => {
  const { gsap } = useGsap()
  if (!gsap)
    return

  elapsed = dominoPlayed.value ? FALL_END + WIND_FADE_DURATION : 0
  ready = dominoPlayed.value
  frameCount = 0
  prevTs = null

  if (heroSvgRef.value) {
    gsap.fromTo(heroSvgRef.value, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
    updateBgDotsSize()
    bgDotsRO = new ResizeObserver(updateBgDotsSize)
    bgDotsRO.observe(heroSvgRef.value)
  }

  if (svgBgRef.value) {
    const el = svgBgRef.value as unknown as Element
    gsap.to(el, {
      opacity: 0.85,
      duration: 1.8,
      ease: 'power2.out',
      onComplete() {
        const tl = gsap.timeline({ repeat: -1 })
        tl.to(el, { opacity: 0.45, duration: 1.4, ease: 'sine.inOut' })
          .to(el, { opacity: 0.85, duration: 1.2, ease: 'sine.inOut' })
          .to(el, { opacity: 0.05, duration: 0.06, ease: 'none' })
          .to(el, { opacity: 0.7, duration: 0.05, ease: 'none' })
          .to(el, { opacity: 0.08, duration: 0.08, ease: 'none' })
          .to(el, { opacity: 0.8, duration: 0.4, ease: 'power2.out' })
          .to(el, { opacity: 0.4, duration: 1.5, ease: 'sine.inOut' })
          .to(el, { opacity: 0.82, duration: 1.3, ease: 'sine.inOut' })
      },
    })
  }

  rafId = requestAnimationFrame(svgTick)
})

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  bgDotsRO?.disconnect()
  bgDotsRO = null
})

const sceneClasses = computed(() => props.sceneClass)
</script>

<template>
  <div :class="sceneClasses">
    <svg
      ref="heroSvgRef"
      class="relative left-1/2 w-full min-w-[900px] -translate-x-1/2 md:min-w-[1400px]"
      style="opacity: 0; overflow: visible;"
      viewBox="292 0 1494 1099"
      preserveAspectRatio="xMidYMin meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 背景裝飾點陣圖：JS 反縮放，icon 固定 16px 不隨 viewport 縮放 -->
      <image
        ref="svgBgDotsRef"
        href="/hero-bg-md.svg"
        x="630"
        width="1478"
        height="707"
      />

      <!-- 左扇 (藍/青色系, 15 張) -->
      <g
        v-for="i in layers"
        :key="`tl-${i}`"
        :ref="(el: unknown) => setLeftTileRef(el, i)"
        :transform="leftInitialTransforms[i]"
      >
        <rect
          :x="-TILE / 2"
          :y="-TILE / 2"
          :width="TILE"
          :height="TILE"
          :rx="TILE_RX"
          :fill="leftLayerColors[i]"
          :fill-opacity="leftLayerOpacities[i]"
          transform="skewX(15)"
        />
      </g>

      <!-- 右扇 (粉/黃色系, 15 張) -->
      <g
        v-for="i in layers"
        :key="`tr-${i}`"
        :ref="(el: unknown) => setRightTileRef(el, i)"
        :transform="rightInitialTransforms[i]"
      >
        <rect
          :x="-TILE / 2"
          :y="-TILE / 2"
          :width="TILE"
          :height="TILE"
          :rx="TILE_RX"
          :fill="rightLayerColors[i]"
          :fill-opacity="rightLayerOpacities[i]"
          transform="skewX(15)"
        />
      </g>

      <!-- 電路板底圖 (GSAP 霓虹閃爍) -->
      <image
        ref="svgBgRef"
        href="/home/hero-middle-bg.svg"
        x="656.47"
        y="286.628"
        width="615.668"
        height="646.435"
        opacity="0"
      />

      <!-- 中心骨牌圖 -->
      <image
        href="/home/hero-middle.svg"
        x="656.47"
        y="286.628"
        width="615.668"
        height="646.435"
      />
    </svg>
  </div>
</template>
