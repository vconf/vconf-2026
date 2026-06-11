<script setup lang="ts">
import { useResizeObserver, useWindowSize } from '@vueuse/core'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

const { gsap } = useGsap()
const ORBIT_RADIUS_MOBILE = 72
const ORBIT_RADIUS_DESKTOP = 140
const MD_BREAKPOINT = 768
const ORBIT_ICON_WIDTH = 16
const ORBIT_ICON_HEIGHT = 15
const ORBIT_STROKE_WIDTH = 1
const ORBIT_CONTENT_GAP = 16
const ORBIT_ICON_PADDING = Math.hypot(ORBIT_ICON_WIDTH, ORBIT_ICON_HEIGHT) / 2
const ORBIT_FRAME_INSET = ORBIT_ICON_PADDING + ORBIT_STROKE_WIDTH / 2
const ORBIT_CONTENT_INSET = ORBIT_FRAME_INSET + ORBIT_CONTENT_GAP

const { width: viewportWidth } = useWindowSize()

const SPONSOR_GROUPS = [
  {
    label: '10x Sponsor',
    widthClass: 'w-[calc((100%-1.5rem)/2)]',
    sponsors: [
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '480', height: '162' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '480', height: '162' },
    ],
  },
  {
    label: '5x Sponsor',
    widthClass: 'w-[calc((100%-3rem)/3)]',
    sponsors: [
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
    ],
  },
  {
    label: '3x Sponsor',
    widthClass: 'w-[calc((100%-3rem)/3)]',
    sponsors: [
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
      { name: 'Google', href: '#', src: '/home/sponsor-logo-google-large.svg', width: '313', height: '106' },
    ],
  },
] as const

const orbitFrameRef = ref<HTMLDivElement | null>(null)
const orbitPathRef = ref<SVGPathElement | null>(null)
const viteIcon1Ref = ref<SVGImageElement | null>(null)
const viteIcon2Ref = ref<SVGImageElement | null>(null)
const viteIcon3Ref = ref<SVGImageElement | null>(null)
const viteIcon4Ref = ref<SVGImageElement | null>(null)

const orbitSize = reactive({
  width: 0,
  height: 0,
})

const activeTweens: Array<{ kill: () => void }> = []
let orbitSyncRafId: number | null = null

const maxOrbitRadius = computed(() =>
  viewportWidth.value < MD_BREAKPOINT ? ORBIT_RADIUS_MOBILE : ORBIT_RADIUS_DESKTOP,
)

const orbitRadius = computed(() => {
  return Math.min(
    maxOrbitRadius.value,
    (orbitSize.width - ORBIT_FRAME_INSET * 2) / 2,
    (orbitSize.height - ORBIT_FRAME_INSET * 2) / 2,
  )
})

const orbitViewBox = computed(() => {
  return `0 0 ${orbitSize.width} ${orbitSize.height}`
})

const isOrbitReady = computed(() => orbitSize.width > 0 && orbitSize.height > 0)

const orbitContentStyle = computed(() => ({
  paddingInline: `${ORBIT_CONTENT_INSET}px`,
  paddingBottom: `${ORBIT_CONTENT_GAP}px`,
}))

const orbitRect = computed(() => {
  return {
    x: ORBIT_FRAME_INSET,
    y: ORBIT_FRAME_INSET,
    width: Math.max(orbitSize.width - ORBIT_FRAME_INSET * 2, 0),
    height: Math.max(orbitSize.height - ORBIT_FRAME_INSET * 2, 0),
    rx: orbitRadius.value,
  }
})

const orbitPathD = computed(() => {
  const left = ORBIT_FRAME_INSET
  const top = ORBIT_FRAME_INSET
  const right = Math.max(orbitSize.width - ORBIT_FRAME_INSET, left)
  const bottom = Math.max(orbitSize.height - ORBIT_FRAME_INSET, top)
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
    !isOrbitReady.value
    || !orbitPathRef.value
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

function syncOrbitLayout() {
  updateOrbitSize()
  nextTick(() => {
    restartOrbitTweens()
  })
}

useResizeObserver(orbitFrameRef, () => {
  syncOrbitLayout()
})

onMounted(() => {
  gsap.registerPlugin(MotionPathPlugin)

  syncOrbitLayout()
  orbitSyncRafId = window.requestAnimationFrame(() => {
    syncOrbitLayout()
    orbitSyncRafId = null
  })
})

watch(orbitPathD, () => {
  nextTick(() => {
    restartOrbitTweens()
  })
})

watch(viewportWidth, () => {
  syncOrbitLayout()
})

onBeforeUnmount(() => {
  if (orbitSyncRafId !== null) {
    window.cancelAnimationFrame(orbitSyncRafId)
  }
  killOrbitTweens()
})
</script>

<template>
  <section class="overflow-x-clip pt-[178px] md:pt-[224px]">
    <div class="container relative">
      <ShareSectionTitle
        title="Sponsor"
        :margin-bottom="56"
        breakpoint="md"
        class="pb-[90px] md:pb-[162px]"
      />

      <div class="relative mx-auto w-full overflow-visible px-4 pb-[52px] pt-[100px] md:px-12 md:pb-[111px] md:pt-[205px] lg:px-[90px]">
        <!-- 軌道 -->
        <div
          ref="orbitFrameRef"
          class="pointer-events-none absolute inset-x-4 inset-y-0 overflow-visible"
          aria-hidden="true"
        >
          <svg
            v-if="isOrbitReady"
            class="size-full overflow-visible"
            :viewBox="orbitViewBox"
            preserveAspectRatio="none"
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
              :stroke-width="ORBIT_STROKE_WIDTH"
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
              :x="-ORBIT_ICON_WIDTH / 2"
              :y="-ORBIT_ICON_HEIGHT / 2"
              :width="ORBIT_ICON_WIDTH"
              :height="ORBIT_ICON_HEIGHT"
            />
            <image
              ref="viteIcon2Ref"
              href="/share/vite-icon.svg"
              :x="-ORBIT_ICON_WIDTH / 2"
              :y="-ORBIT_ICON_HEIGHT / 2"
              :width="ORBIT_ICON_WIDTH"
              :height="ORBIT_ICON_HEIGHT"
            />
            <image
              ref="viteIcon3Ref"
              href="/share/vite-icon.svg"
              :x="-ORBIT_ICON_WIDTH / 2"
              :y="-ORBIT_ICON_HEIGHT / 2"
              :width="ORBIT_ICON_WIDTH"
              :height="ORBIT_ICON_HEIGHT"
            />
            <image
              ref="viteIcon4Ref"
              href="/share/vite-icon.svg"
              :x="-ORBIT_ICON_WIDTH / 2"
              :y="-ORBIT_ICON_HEIGHT / 2"
              :width="ORBIT_ICON_WIDTH"
              :height="ORBIT_ICON_HEIGHT"
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
        <div
          class="relative z-10 mx-auto grid place-items-center gap-8 md:gap-16"
          :style="orbitContentStyle"
        >
          <div
            v-for="group in SPONSOR_GROUPS"
            :key="group.label"
            class="w-full"
          >
            <h3 class="mb-[17px] text-center font-serif text-[20px] font-bold leading-[1.6] tracking-[0em]  text-vconf-primary md:mb-6 md:text-[48px] md:leading-[auto]">
              {{ group.label }}
            </h3>
            <div
              class="flex flex-wrap justify-center gap-2 md:gap-6"
            >
              <a
                v-for="sponsor in group.sponsors"
                :key="sponsor.name"
                :href="sponsor.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex aspect-square items-center justify-center border border-vconf-gray-exlight"
                :class="group.widthClass"
              >
                <NuxtImg
                  :src="sponsor.src"
                  :width="sponsor.width"
                  :height="sponsor.height"
                  class="h-auto w-full object-contain"
                  :alt="sponsor.name"
                />
              </a>
            </div>
          </div>
        </div>
        <!-- All Sponsors 按鈕 -->
        <NuxtLink
          to="/sponsors"
          class="absolute bottom-[-10px] left-1/2 -translate-x-1/2 rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:px-12 md:py-3 md:text-[21px]"
        >
          All Sponsors
        </NuxtLink>
      </div>

      <!-- 背景 vite icon x2  -->
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute left-[238px] top-[81px] hidden lg:block"
      />
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[106px] top-[25px] hidden md:right-[145px] md:top-[87px] md:block"
      />
    </div>
  </section>
</template>
