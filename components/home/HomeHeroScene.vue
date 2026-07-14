<script setup lang="ts">
import {
  useDocumentVisibility,
  useIntersectionObserver,
  usePreferredReducedMotion,
} from '@vueuse/core'
import { nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import {
  ANCHOR_Y,
  DOTS_CX,
  DOTS_GAP_PX,
  DOTS_OFFSET_PX_SM,
  DOTS_PINNED_CX,
  DOTS_PINNED_GAP_PX,
  DOTS_REF_Y,
  heroVGapPx,
  layers,
  leftLayerColors,
  leftLayerOpacities,
  leftPolygons,
  leftYShift,
  paintLayers,
  rightLayerColors,
  rightLayerOpacities,
  rightPolygons,
  rightShift,
  sceneYShift,
} from './heroScene.config'

// ── SVG refs ──────────────────────────────────────────────────────────────────
const rootRef = ref<HTMLElement | null>(null)
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgDotsRef = ref<SVGImageElement | null>(null)
const svgBgRef = ref<SVGImageElement | null>(null)
const hasPlayedHomeHeroIntro = useState('home-hero-intro-played', () => false)
let bgDotsRO: ResizeObserver | null = null
let pinnedMql: MediaQueryList | null = null // 視窗 < 1400（SVG 被 min-w 夾住、s 鎖死）
const leftPolygonRefs = shallowRef<Array<SVGPolygonElement | null>>([])
const rightPolygonRefs = shallowRef<Array<SVGPolygonElement | null>>([])
interface AnimationHandle {
  kill: () => void
  pause: () => void
  resume: () => void
}
const animationHandles: Array<AnimationHandle> = []

// ── 播放狀態（全用 VueUse，避免直接碰 matchMedia / IntersectionObserver / 事件監聽）──────
const reducedMotion = usePreferredReducedMotion() // 'reduce' | 'no-preference'
const documentVisibility = useDocumentVisibility() // 'visible' | 'hidden'
const isHeroInViewport = ref(true)

useIntersectionObserver(
  rootRef,
  ([entry]) => {
    isHeroInViewport.value = entry?.isIntersecting ?? true
  },
  { threshold: 0 },
)

// 只有「在視窗內 且 分頁在前景」才播放，否則暫停全部動畫 → 省 CPU / 電力。
function syncPlayState() {
  const shouldPlay
    = isHeroInViewport.value && documentVisibility.value !== 'hidden'
  animationHandles.forEach(handle =>
    shouldPlay ? handle.resume() : handle.pause(),
  )
}
watch([isHeroInViewport, documentVisibility], syncPlayState)

function setLeftPolygonRef(el: unknown, i: number) {
  leftPolygonRefs.value[i] = el as SVGPolygonElement | null
}

function setRightPolygonRef(el: unknown, i: number) {
  rightPolygonRefs.value[i] = el as SVGPolygonElement | null
}

function updateBgDotsSize() {
  if (!heroSvgRef.value || !svgBgDotsRef.value)
    return
  const w = heroSvgRef.value.getBoundingClientRect().width
  if (w <= 0)
    return
  const s = w / 1494

  // 固定 hero 場景與上方 logo 的距離：補償 SVG 等比縮放（桌機才鎖定；手機沿用 class 邊距）
  if (rootRef.value) {
    rootRef.value.style.marginTop
      = w < 1000 ? '' : `${heroVGapPx - ANCHOR_Y * s}px`
  }

  // 手機偵測：mobile min-w=900px，桌機 min-w=1400px，用 1000px 為分界
  if (w < 1000) {
    // hero-bg-sm.svg 原生 705×392，icon ~8px SVG units → 反縮放後固定 8px CSS
    const dotW = Math.round(705 / s)
    const dotH = Math.round(392 / s)
    svgBgDotsRef.value.setAttribute('href', '/hero-bg-sm.svg')
    // +150 = 點陣中心相對 viewBox 1039 往右的位移；調小 → 往左、調大 → 往右
    svgBgDotsRef.value.setAttribute(
      'x',
      String(Math.round(1039 - dotW / 2) + 170),
    )
    svgBgDotsRef.value.setAttribute(
      'y',
      String(Math.round(1099 - DOTS_OFFSET_PX_SM / s)),
    )
    svgBgDotsRef.value.setAttribute('width', String(dotW))
    svgBgDotsRef.value.setAttribute('height', String(dotH))
  }
  else {
    // 桌機：hero-bg-md.svg 原生 1478×707，icon 16px。
    // 反縮放（icon 固定 16px）+ 水平置中；垂直把點陣中心鎖在 hero 基準線下方
    //   固定 GAP 的 CSS px（centerY = REF_Y + GAP/s 補償縮放）→ 上下間距固定。
    // pinned 區用獨立 CX/GAP，可單獨定位、不影響大螢幕。
    // 偵測：對應 SVG 在視窗 <1400 被 md:min-w-[1400px] 夾住。用 matchMedia.matches（與 CSS
    // 斷點同源），搭配 onMounted 掛的 change 事件可在重新整理/跨界時即時重算（SVG-RO 會漏）。
    const isPinned = pinnedMql ? pinnedMql.matches : window.innerWidth < 1400
    const cx = isPinned ? DOTS_PINNED_CX : DOTS_CX
    const gapPx = isPinned ? DOTS_PINNED_GAP_PX : DOTS_GAP_PX
    const dotW = 1478 / s
    const dotH = 707 / s
    const centerY = DOTS_REF_Y + gapPx / s
    svgBgDotsRef.value.setAttribute('href', '/hero-bg-md.svg')
    svgBgDotsRef.value.setAttribute('width', String(Math.round(dotW)))
    svgBgDotsRef.value.setAttribute('height', String(Math.round(dotH)))
    svgBgDotsRef.value.setAttribute('x', String(Math.round(cx - dotW / 2)))
    svgBgDotsRef.value.setAttribute(
      'y',
      String(Math.round(centerY - dotH / 2)),
    )
  }
}

function createSvgOrigin(el: SVGGraphicsElement, side: 'left' | 'right') {
  const box = el.getBBox()
  const originX
    = side === 'left' ? box.x + box.width * 0.28 : box.x + box.width * 0.72
  const originY = box.y + box.height * 0.92
  return `${originX} ${originY}`
}

function applyFinalSceneState() {
  const { gsap } = useGsap()
  if (!gsap)
    return

  if (heroSvgRef.value)
    gsap.set(heroSvgRef.value, { opacity: 1 })

  if (svgBgRef.value)
    gsap.set(svgBgRef.value, { opacity: 0.76 })

  leftPolygonRefs.value.forEach((el) => {
    if (!el)
      return
    gsap.set(el, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
    })
  })

  rightPolygonRefs.value.forEach((el) => {
    if (!el)
      return
    gsap.set(el, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
    })
  })
}

function startAmbientAnimation() {
  const { gsap } = useGsap()
  if (!gsap)
    return

  leftPolygonRefs.value.forEach((el, i) => {
    if (!el)
      return

    gsap.set(el, {
      transformBox: 'fill-box',
      svgOrigin: createSvgOrigin(el, 'left'),
    })

    animationHandles.push(
      gsap.to(el, {
        x: -4 - (i % 3),
        y: -3 - (i % 2),
        rotation: -0.9 - i * 0.045,
        duration: 2.4 + i * 0.08,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
      }),
    )
  })

  rightPolygonRefs.value.forEach((el, i) => {
    if (!el)
      return

    gsap.set(el, {
      transformBox: 'fill-box',
      svgOrigin: createSvgOrigin(el, 'right'),
    })

    animationHandles.push(
      gsap.to(el, {
        x: 4 + (i % 3),
        y: 3 + (i % 2),
        rotation: 0.95 + i * 0.04,
        duration: 2.55 + i * 0.08,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.12 + i * 0.05,
      }),
    )
  })

  if (svgBgRef.value) {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.18 })
    tl.to(svgBgRef.value, { opacity: 0.44, duration: 1.3, ease: 'sine.inOut' })
      .to(svgBgRef.value, { opacity: 0.84, duration: 1.05, ease: 'sine.inOut' })
      .to(svgBgRef.value, { opacity: 0.18, duration: 0.09, ease: 'none' })
      .to(svgBgRef.value, { opacity: 0.78, duration: 0.08, ease: 'none' })
      .to(svgBgRef.value, {
        opacity: 0.58,
        duration: 1.45,
        ease: 'sine.inOut',
      })
    animationHandles.push(tl)
  }
}

function startIntroAnimation() {
  const { gsap } = useGsap()
  if (!gsap)
    return 0

  const svgWidth = heroSvgRef.value?.getBoundingClientRect().width ?? 0
  const isMobile = svgWidth > 0 && svgWidth < 1000

  if (isMobile) {
    if (svgBgRef.value)
      (svgBgRef.value as unknown as SVGElement).setAttribute('opacity', '1')
    if (heroSvgRef.value)
      heroSvgRef.value.style.opacity = '1'
    hasPlayedHomeHeroIntro.value = true
    return 0
  }

  const introYOffset = 54

  const leftEls = layers
    .map(i => leftPolygonRefs.value[i])
    .filter(Boolean) as SVGPolygonElement[]
  const rightEls = layers
    .map(i => rightPolygonRefs.value[i])
    .filter(Boolean) as SVGPolygonElement[]

  if (heroSvgRef.value) {
    animationHandles.push(
      gsap.fromTo(
        heroSvgRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
      ),
    )
  }

  leftEls.forEach((el, i) => {
    const delay = i * 0.07
    const tl = gsap.timeline()
    tl.set(el, {
      transformBox: 'fill-box',
      svgOrigin: createSvgOrigin(el, 'left'),
    })
    tl.fromTo(
      el,
      {
        opacity: 0,
        y: introYOffset,
        rotation: -16 + i * 0.35,
        scale: 0.94,
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.72,
        delay,
        ease: 'power3.out',
      },
    )
    animationHandles.push(tl)
  })

  const rightStartDelay = 0.18 + leftEls.length * 0.05
  rightEls.forEach((el, i) => {
    const delay = rightStartDelay + i * 0.07
    const tl = gsap.timeline()
    tl.set(el, {
      transformBox: 'fill-box',
      svgOrigin: createSvgOrigin(el, 'right'),
    })
    tl.fromTo(
      el,
      {
        opacity: 0,
        y: introYOffset,
        rotation: 16 - i * 0.28,
        scale: 0.94,
      },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.72,
        delay,
        ease: 'power3.out',
      },
    )
    animationHandles.push(tl)
  })

  if (svgBgRef.value) {
    const tl = gsap.timeline()
    tl.fromTo(
      svgBgRef.value,
      { opacity: 0.05 },
      { opacity: 0.82, duration: 1.2, ease: 'power2.out' },
    ).to(svgBgRef.value, { opacity: 0.58, duration: 1.1, ease: 'sine.inOut' })
    animationHandles.push(tl)
  }

  hasPlayedHomeHeroIntro.value = true
  return 2.4
}

// ── onMounted ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (heroSvgRef.value) {
    // 先建立 matchMedia 再首次量測，確保第一次就讀得到 matches。
    // change 事件會在視窗跨越 1400 的當下重算 → 補上 SVG-ResizeObserver 漏掉的那次
    // （SVG 在 pinned 區一直被夾在 1400、寬度不變 → RO 不觸發）。
    pinnedMql = window.matchMedia('(max-width: 1399.98px)')
    pinnedMql.addEventListener('change', updateBgDotsSize)
    updateBgDotsSize()
    bgDotsRO = new ResizeObserver(updateBgDotsSize)
    bgDotsRO.observe(heroSvgRef.value)
    // 首屏視窗可能尚未定案（裝置模式會先用真實寬載入）→ 下一幀再校一次。
    requestAnimationFrame(() => updateBgDotsSize())
  }

  await nextTick()

  // 尊重「減少動態效果」：不論裝置寬度，直接顯示靜態最終畫面，不掛 intro / ambient（同時省效能）。
  if (reducedMotion.value === 'reduce') {
    if (heroSvgRef.value)
      heroSvgRef.value.style.opacity = '1'
    if (svgBgRef.value)
      svgBgRef.value.setAttribute('opacity', '0.76')
    hasPlayedHomeHeroIntro.value = true
    return
  }

  // 手機版（SVG < 1000）不跑任何動畫：直接顯示靜態最終狀態，不掛 intro / ambient。
  // 多邊形本來就以 fill-opacity 靜態渲染（沒套 GSAP transform），只需把兩個預設藏起來的
  // 元素（heroSvg 與電路板底圖）顯示出來即可。
  const mobileWidth = heroSvgRef.value?.getBoundingClientRect().width ?? 0
  if (mobileWidth > 0 && mobileWidth < 1000) {
    if (heroSvgRef.value)
      heroSvgRef.value.style.opacity = '1'
    if (svgBgRef.value)
      svgBgRef.value.setAttribute('opacity', '0.76')
    hasPlayedHomeHeroIntro.value = true
    return
  }

  if (hasPlayedHomeHeroIntro.value) {
    applyFinalSceneState()
    startAmbientAnimation()
  }
  else {
    const introDuration = startIntroAnimation()
    const { gsap } = useGsap()
    if (gsap && introDuration > 0) {
      animationHandles.push(
        gsap.delayedCall(introDuration, startAmbientAnimation),
      )
    }
    else {
      startAmbientAnimation()
    }
  }

  // 動畫是在此刻才建立的，watch(immediate) 當時陣列還空 → 依目前可見狀態補同步一次
  // （涵蓋「載入時 hero 已在畫面外／分頁在背景」就不該空轉的情況）。
  syncPlayState()
})

onUnmounted(() => {
  animationHandles.forEach(handle => handle.kill())
  animationHandles.length = 0
  bgDotsRO?.disconnect()
  bgDotsRO = null
  pinnedMql?.removeEventListener('change', updateBgDotsSize)
  pinnedMql = null
})
</script>

<template>
  <div
    ref="rootRef"
    class="w-full"
  >
    <svg
      ref="heroSvgRef"
      class="relative left-1/2 w-full min-w-[900px] -translate-x-1/2 md:min-w-[1400px]"
      style="opacity: 0; overflow: visible"
      viewBox="292 0 1494 1099"
      preserveAspectRatio="xMidYMin meet"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g :transform="`translate(0,${sceneYShift})`">
        <!-- 背景裝飾點陣圖：JS 反縮放，icon 固定 16px 不隨 viewport 縮放 -->
        <image
          ref="svgBgDotsRef"
          href="/hero-bg-md.svg"
          x="391"
          y="637"
          width="1478"
          height="707"
          fetchpriority="high"
        />

        <!-- 左扇 (藍/青色系, 15 張) -->
        <g :transform="`translate(0,${leftYShift})`">
          <polygon
            v-for="i in paintLayers"
            :key="`tl-${i}`"
            :ref="(el: unknown) => setLeftPolygonRef(el, i)"
            :points="leftPolygons[i]"
            :fill="leftLayerColors[i]"
            :fill-opacity="leftLayerOpacities[i]"
          />
        </g>

        <!-- 右扇 (粉/黃色系, 15 張) -->
        <g :transform="`translate(${rightShift.x},${rightShift.y})`">
          <polygon
            v-for="i in paintLayers"
            :key="`tr-${i}`"
            :ref="(el: unknown) => setRightPolygonRef(el, i)"
            :points="rightPolygons[i]"
            :fill="rightLayerColors[i]"
            :fill-opacity="rightLayerOpacities[i]"
          />
        </g>

        <!-- 電路板底圖 (GSAP 霓虹閃爍)：放中央 V 之前 → 疊在 V 後面 -->
        <image
          ref="svgBgRef"
          href="/home/hero-middle-bg.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
          opacity="0"
          fetchpriority="high"
        />

        <!-- 中心骨牌圖：放最後 → 疊在最前面 -->
        <image
          href="/home/hero-middle.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
          fetchpriority="high"
        />
      </g>
    </svg>
  </div>
</template>
