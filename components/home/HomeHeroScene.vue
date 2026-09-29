<script setup lang="ts">
import {
  useDocumentVisibility,
  useIntersectionObserver,
  usePreferredReducedMotion,
  useResizeObserver,
} from '@vueuse/core'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  DOTS_CX,
  DOTS_GAP_PX,
  DOTS_OFFSET_PX_SM,
  DOTS_PINNED_CX,
  DOTS_PINNED_GAP_PX,
  DOTS_REF_Y,
  heroScenes,
  heroTransforms,
  sceneYShift,
} from './heroScene.config'

type Breakpoint = keyof typeof heroScenes
type Side = 'left' | 'right'

// 淺色、深色與桌機、手機都輸出，用 dark: / md: class 切換；SSR 不知道使用者的模式與寬度
const modes = [
  { key: 'light', class: 'dark:hidden' },
  { key: 'dark', class: 'hidden dark:inline' },
] as const
const breakpoints = [
  { key: 'desktop', class: 'hidden md:inline' },
  { key: 'mobile', class: 'md:hidden' },
] as const

const rootRef = ref<HTMLElement | null>(null)
const heroSvgRef = ref<SVGSVGElement | null>(null)
const svgBgDotsRef = ref<SVGImageElement | null>(null)
// 綁成變數：寫死在 <image href> 上會被 Vite 的資源網址轉換改寫，SSR 與 client 不一致
const DOTS_HREF_MD = '/hero-bg-md.svg'
let removeTransitionHook: (() => void) | null = null
const hasPlayedHomeHeroIntro = useState('home-hero-intro-played', () => false)
// 只收桌機的扇片：手機不跑動畫
const polygonRefs: Record<Side, Set<SVGPolygonElement>> = {
  left: new Set(),
  right: new Set(),
}
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

function setPolygonRef(el: unknown, bp: Breakpoint, side: Side) {
  if (bp === 'desktop' && el)
    polygonRefs[side].add(el as SVGPolygonElement)
}

// 資料由下往上排，反過來數：最上層（最靠內側）那片是 0，進場最早
function stackIndex(el: SVGPolygonElement) {
  const siblings = Array.from(el.parentElement?.children ?? [])
  return siblings.length - 1 - siblings.indexOf(el)
}

// 用頂點算外框而非 getBBox()：另一個色彩模式的那組是 display: none，getBBox() 會回 0
function createSvgOrigin(el: SVGPolygonElement, side: Side) {
  const points = Array.from(el.points)
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const width = Math.max(...xs) - minX
  const height = Math.max(...ys) - minY
  const originX = side === 'left' ? minX + width * 0.28 : minX + width * 0.72
  const originY = minY + height * 0.92
  return `${originX} ${originY}`
}

function showStatic() {
  if (heroSvgRef.value)
    heroSvgRef.value.style.opacity = '1'
  hasPlayedHomeHeroIntro.value = true
}

function startAmbientAnimation() {
  const { gsap } = useGsap()
  if (!gsap)
    return

  polygonRefs.left.forEach((el) => {
    const i = stackIndex(el)
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

  polygonRefs.right.forEach((el) => {
    const i = stackIndex(el)
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

  const introYOffset = 54

  if (heroSvgRef.value) {
    animationHandles.push(
      gsap.fromTo(
        heroSvgRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power2.out' },
      ),
    )
  }

  // 淺色、深色兩組一起跑：同一層同時進場，切換模式時畫面不會停在半途
  polygonRefs.left.forEach((el) => {
    const i = stackIndex(el)
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
        delay: i * 0.07,
        ease: 'power3.out',
      },
    )
    animationHandles.push(tl)
  })

  const layerCount = Math.max(...Array.from(polygonRefs.left, stackIndex)) + 1
  const rightStartDelay = 0.18 + layerCount * 0.05
  polygonRefs.right.forEach((el) => {
    const i = stackIndex(el)
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
        delay: rightStartDelay + i * 0.07,
        ease: 'power3.out',
      },
    )
    animationHandles.push(tl)
  })

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

  if (reducedMotion.value === 'reduce' || getHeroSvgCssWidth() < 1000) {
    showStatic()
    return
  }

  if (hasPlayedHomeHeroIntro.value) {
    showStatic()
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
      showStatic()
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
        <!-- 背景裝飾點陣圖：JS 反縮放，icon 固定 16px 不隨 viewport 縮放；淺深共用、墊在最底 -->
        <image
          ref="svgBgDotsRef"
          :href="DOTS_HREF_MD"
          x="391"
          y="637"
          width="1478"
          height="707"
        />

        <g
          v-for="mode in modes"
          :key="mode.key"
          :class="mode.class"
        >
          <g
            v-for="bp in breakpoints"
            :key="bp.key"
            :class="bp.class"
            :transform="heroTransforms[bp.key]"
          >
            <!-- 圖層順序照各稿的 Figma 圖層（由下往上） -->
            <template
              v-for="layer in heroScenes[bp.key][mode.key].order"
              :key="layer"
            >
              <g v-if="layer === 'right' || layer === 'left'">
                <polygon
                  v-for="(points, i) in heroScenes[bp.key][mode.key][layer]
                    .polygons"
                  :key="i"
                  :ref="(el: unknown) => setPolygonRef(el, bp.key, layer)"
                  :points="points"
                  :fill="heroScenes[bp.key][mode.key][layer].colors[i]"
                  :fill-opacity="
                    heroScenes[bp.key][mode.key][layer].opacities[i]
                  "
                />
              </g>
              <image
                v-else
                :href="heroScenes[bp.key][mode.key][layer].href"
                :x="heroScenes[bp.key][mode.key][layer].x"
                :y="heroScenes[bp.key][mode.key][layer].y"
                :width="heroScenes[bp.key][mode.key][layer].width"
                :height="heroScenes[bp.key][mode.key][layer].height"
              />
            </template>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>
