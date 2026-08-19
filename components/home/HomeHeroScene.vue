<script setup lang="ts">
import {
  useDocumentVisibility,
  useIntersectionObserver,
  usePreferredReducedMotion,
  useResizeObserver,
} from '@vueuse/core'
import { nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import {
  DOTS_CX,
  DOTS_GAP_PX,
  DOTS_OFFSET_PX_SM,
  DOTS_PINNED_CX,
  DOTS_PINNED_GAP_PX,
  DOTS_REF_Y,
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

const rootRef = ref<HTMLElement | null>(null)
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgDotsRef = ref<SVGImageElement | null>(null)
const svgBgRef = ref<SVGImageElement | null>(null)
const hasPlayedHomeHeroIntro = useState('home-hero-intro-played', () => false)
let removeTransitionHook: (() => void) | null = null
const leftPolygonRefs = shallowRef<Array<SVGPolygonElement | null>>([])
const rightPolygonRefs = shallowRef<Array<SVGPolygonElement | null>>([])
interface AnimationHandle {
  kill: () => void
  pause: () => void
  resume: () => void
}
const animationHandles: Array<AnimationHandle> = []

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

useResizeObserver([rootRef, heroSvgRef], () => updateBgDotsSize())

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

function getHeroSvgCssWidth() {
  const vw = window.innerWidth
  return vw < 768 ? Math.max(900, vw) : Math.max(1400, vw)
}

function updateBgDotsSize() {
  if (!svgBgDotsRef.value)
    return
  const w = getHeroSvgCssWidth()
  const s = w / 1494

  if (w < 1000) {
    const dotW = Math.round(705 / s)
    const dotH = Math.round(392 / s)
    svgBgDotsRef.value.setAttribute('href', '/hero-bg-sm.svg')
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
    const isPinned = window.innerWidth < 1400
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
}

function startIntroAnimation() {
  const { gsap } = useGsap()
  if (!gsap)
    return 0

  const isMobile = getHeroSvgCssWidth() < 1000

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
    animationHandles.push(
      gsap.fromTo(
        svgBgRef.value,
        { opacity: 0.05 },
        { opacity: 0.76, duration: 1.2, ease: 'power2.out' },
      ),
    )
  }

  hasPlayedHomeHeroIntro.value = true
  return 2.4
}

onMounted(async () => {
  if (heroSvgRef.value) {
    updateBgDotsSize()
    removeTransitionHook = useNuxtApp().hook(
      'page:transition:finish',
      updateBgDotsSize,
    )
  }

  await nextTick()

  if (reducedMotion.value === 'reduce') {
    if (heroSvgRef.value)
      heroSvgRef.value.style.opacity = '1'
    if (svgBgRef.value)
      svgBgRef.value.setAttribute('opacity', '0.76')
    hasPlayedHomeHeroIntro.value = true
    return
  }

  if (getHeroSvgCssWidth() < 1000) {
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

  syncPlayState()
})

onUnmounted(() => {
  animationHandles.forEach(handle => handle.kill())
  animationHandles.length = 0
  removeTransitionHook?.()
  removeTransitionHook = null
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

        <!-- 電路板底圖：放中央 V 之前 → 疊在 V 後面 -->
        <image
          ref="svgBgRef"
          href="/home/hero-middle-bg.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
          opacity="0"
        />

        <!-- 中心骨牌圖：放最後 → 疊在最前面 -->
        <image
          href="/home/hero-middle.svg"
          x="656.47"
          y="286.628"
          width="615.668"
          height="646.435"
        />
      </g>
    </svg>
  </div>
</template>
