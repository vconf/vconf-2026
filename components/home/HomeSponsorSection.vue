<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

const { gsap } = useGsap()
const ORBIT_RADIUS_MOBILE = 72
const ORBIT_RADIUS_DESKTOP = 140
const MD_BREAKPOINT = 768
const ORBIT_STROKE_INSET = 0.5

const { width: viewportWidth } = useWindowSize()

const SPONSORS = [
  {
    name: 'Apple',
    href: '#',
    src: '/home/apple.svg',
    width: '223',
    height: '72',
  },
  {
    name: 'Google',
    href: '#',
    src: '/home/google.svg',
    width: '207',
    height: '69',
  },
  {
    name: 'Nike',
    href: '#',
    src: '/home/nike.svg',
    width: '246',
    height: '88',
  },
  {
    name: 'AMD',
    href: '#',
    src: '/home/amd.svg',
    width: '179',
    height: '50',
  },
  {
    name: 'Glant',
    href: '#',
    src: '/home/glant.svg',
    width: '189',
    height: '45',
  },
  {
    name: 'GitHub',
    href: '#',
    src: '/home/github.svg',
    width: '242',
    height: '82',
  },
] as const

const orbitFrameRef = ref<HTMLDivElement | null>(null)
const orbitPathRef = ref<SVGPathElement | null>(null)
const viteIcon1Ref = ref<SVGImageElement | null>(null)
const viteIcon2Ref = ref<SVGImageElement | null>(null)
const viteIcon3Ref = ref<SVGImageElement | null>(null)
const viteIcon4Ref = ref<SVGImageElement | null>(null)

const orbitSize = reactive({
  width: 1161,
  height: 682,
})

const activeTweens: Array<{ kill: () => void }> = []
let resizeObserver: ResizeObserver | null = null

const maxOrbitRadius = computed(() =>
  viewportWidth.value < MD_BREAKPOINT ? ORBIT_RADIUS_MOBILE : ORBIT_RADIUS_DESKTOP,
)

const orbitRadius = computed(() => {
  return Math.min(
    maxOrbitRadius.value,
    (orbitSize.width - ORBIT_STROKE_INSET * 2) / 2,
    (orbitSize.height - ORBIT_STROKE_INSET * 2) / 2,
  )
})

const orbitViewBox = computed(() => {
  return `0 0 ${orbitSize.width} ${orbitSize.height}`
})

const orbitRect = computed(() => {
  return {
    x: ORBIT_STROKE_INSET,
    y: ORBIT_STROKE_INSET,
    width: Math.max(orbitSize.width - ORBIT_STROKE_INSET * 2, 0),
    height: Math.max(orbitSize.height - ORBIT_STROKE_INSET * 2, 0),
    rx: orbitRadius.value,
  }
})

const orbitPathD = computed(() => {
  const left = ORBIT_STROKE_INSET
  const top = ORBIT_STROKE_INSET
  const right = Math.max(orbitSize.width - ORBIT_STROKE_INSET, left)
  const bottom = Math.max(orbitSize.height - ORBIT_STROKE_INSET, top)
  const radius = orbitRadius.value

  return [
    `M ${left + radius} ${top}`,
    `H ${right - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${top + radius}`,
    `V ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `H ${left + radius}`,
    `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius}`,
    `V ${top + radius}`,
    `A ${radius} ${radius} 0 0 1 ${left + radius} ${top}`,
  ].join(' ')
})

function createOrbitTween(
  element: SVGImageElement,
  path: SVGPathElement,
  start: number,
  duration: number,
) {
  return gsap.to(element, {
    duration,
    repeat: -1,
    ease: 'none',
    motionPath: {
      path,
      align: path,
      alignOrigin: [0.5, 0.5],
      autoRotate: true,
      start,
      end: start + 1,
    },
  })
}

function killOrbitTweens() {
  activeTweens.forEach(tween => tween.kill())
  activeTweens.length = 0
}

function restartOrbitTweens() {
  if (
    !orbitPathRef.value
    || !viteIcon1Ref.value
    || !viteIcon2Ref.value
    || !viteIcon3Ref.value
    || !viteIcon4Ref.value
  ) {
    return
  }

  killOrbitTweens()

  activeTweens.push(
    createOrbitTween(viteIcon1Ref.value, orbitPathRef.value, 0, 16),
    createOrbitTween(viteIcon2Ref.value, orbitPathRef.value, 0.25, 16),
    createOrbitTween(viteIcon3Ref.value, orbitPathRef.value, 0.5, 16),
    createOrbitTween(viteIcon4Ref.value, orbitPathRef.value, 0.75, 16),
  )
}

function updateOrbitSize() {
  if (!orbitFrameRef.value) {
    return
  }

  const { width, height } = orbitFrameRef.value.getBoundingClientRect()

  if (!width || !height) {
    return
  }

  orbitSize.width = width
  orbitSize.height = height
}

onMounted(() => {
  gsap.registerPlugin(MotionPathPlugin)

  updateOrbitSize()
  if (orbitFrameRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateOrbitSize()
    })
    resizeObserver.observe(orbitFrameRef.value)
  }
  nextTick(() => {
    restartOrbitTweens()
  })
})

watch(orbitPathD, () => {
  nextTick(() => {
    restartOrbitTweens()
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  killOrbitTweens()
})
</script>

<template>
  <section>
    <div class="container relative">
      <ShareSectionTitle
        title="Sponsor"
        :margin-bottom="56"
        class="pb-[90px] md:pb-[162px]"
      />

      <div class="relative mx-auto w-full max-w-[1161px] overflow-visible px-6 pb-16 pt-[132px] sm:px-10 md:px-14 lg:min-h-[682px] lg:px-[96px] lg:pb-[88px] lg:pt-[174px]">
        <!-- 軌道 -->
        <div
          ref="orbitFrameRef"
          class="pointer-events-none absolute inset-x-4 inset-y-0 overflow-visible"
          aria-hidden="true"
        >
          <svg
            class="size-full overflow-visible"
            :viewBox="orbitViewBox"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              :x="orbitRect.x"
              :y="orbitRect.y"
              :width="orbitRect.width"
              :height="orbitRect.height"
              :rx="orbitRect.rx"
              fill="none"
              stroke="#863BFF"
            />
            <path
              ref="orbitPathRef"
              :d="orbitPathD"
              fill="none"
              stroke="none"
            />
            <image
              ref="viteIcon1Ref"
              href="/share/vite-icon.svg"
              x="-8"
              y="-7.5"
              width="16"
              height="15"
            />
            <image
              ref="viteIcon2Ref"
              href="/share/vite-icon.svg"
              x="-8"
              y="-7.5"
              width="16"
              height="15"
            />
            <image
              ref="viteIcon3Ref"
              href="/share/vite-icon.svg"
              x="-8"
              y="-7.5"
              width="16"
              height="15"
            />
            <image
              ref="viteIcon4Ref"
              href="/share/vite-icon.svg"
              x="-8"
              y="-7.5"
              width="16"
              height="15"
            />
          </svg>
        </div>

        <!-- 錢財圖示 -->
        <div class="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 before:absolute before:inset-y-0 before:left-[-15%] before:w-[15%] before:bg-vconf-white before:content-[''] after:absolute after:inset-y-0 after:right-[-15%] after:w-[15%] after:bg-vconf-white after:content-['']">
          <NuxtImg
            src="/home/sponsor-money.png"
            width="273"
            height="386"
            class="relative hidden bg-vconf-white md:block"
          />
          <NuxtImg
            src="/home/money-small.png"
            width="136"
            height="193"
            class="relative bg-vconf-white md:hidden"
          />
        </div>

        <!-- 贊助商 icon  -->
        <div class="relative z-10 mx-auto grid max-w-[809px] grid-cols-2 place-items-center gap-x-8 gap-y-10 md:grid-cols-3 md:gap-y-16 lg:gap-y-[80px]">
          <a
            v-for="sponsor in SPONSORS"
            :key="sponsor.name"
            :href="sponsor.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-[88px] w-full items-center justify-center"
          >
            <NuxtImg
              :src="sponsor.src"
              :width="sponsor.width"
              :height="sponsor.height"
              :alt="sponsor.name"
              class="h-auto max-w-full"
            />
          </a>
        </div>
      </div>

      <!-- 背景 vite icon x2  -->
      <!-- <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute left-[238px] top-[81px]"
      /> -->
      <!-- <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[145px] top-[87px]"
      /> -->
    </div>
  </section>
</template>
