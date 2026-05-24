<script setup lang="ts">
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

const { gsap } = useGsap()

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

const orbitPathRef = ref<SVGPathElement | null>(null)
const viteIcon1Ref = ref<SVGImageElement | null>(null)
const viteIcon2Ref = ref<SVGImageElement | null>(null)
const viteIcon3Ref = ref<SVGImageElement | null>(null)
const viteIcon4Ref = ref<SVGImageElement | null>(null)

const activeTweens: Array<{ kill: () => void }> = []

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

onMounted(() => {
  if (
    !orbitPathRef.value
    || !viteIcon1Ref.value
    || !viteIcon2Ref.value
    || !viteIcon3Ref.value
    || !viteIcon4Ref.value
  ) {
    return
  }

  gsap.registerPlugin(MotionPathPlugin)

  activeTweens.push(
    createOrbitTween(viteIcon1Ref.value, orbitPathRef.value, 0, 16),
    createOrbitTween(viteIcon2Ref.value, orbitPathRef.value, 0.25, 16),
    createOrbitTween(viteIcon3Ref.value, orbitPathRef.value, 0.5, 16),
    createOrbitTween(viteIcon4Ref.value, orbitPathRef.value, 0.75, 16),
  )
})

onBeforeUnmount(() => {
  activeTweens.forEach(tween => tween.kill())
})
</script>

<template>
  <section>
    <div class="container relative">
      <ShareSectionTitle
        title="Sponsor"
        :padding-bottom="56"
        class="pb-[197px]"
      />

      <div class="relative mx-auto w-full max-w-[1161px] overflow-visible">
        <!-- 外框線圖示 -->
        <NuxtImg
          src="/home/sponsor-bg.svg"
          width="1161"
          height="682"
          class="pointer-events-none mx-auto"
          aria-hidden="true"
        />

        <!-- 錢財圖示 -->
        <div class="absolute left-1/2 top-[-193px] z-10 -translate-x-1/2 before:absolute before:inset-y-0 before:left-[-40px] before:w-10 before:bg-vconf-white before:content-[''] after:absolute after:inset-y-0 after:right-[-40px] after:w-10 after:bg-vconf-white after:content-['']">
          <NuxtImg
            src="/home/sponsor-money.png"
            width="273"
            height="386"
            class="relative bg-vconf-white"
          />
        </div>

        <!-- 軌道移動的 vite icon -->
        <svg
          class="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox="0 0 1161 682"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            ref="orbitPathRef"
            d="M140 0.5H1021C1098.04 0.5 1160.5 62.96 1160.5 140V542C1160.5 619.04 1098.04 681.5 1021 681.5H140C62.96 681.5 0.5 619.04 0.5 542V140C0.5 62.96 62.96 0.5 140 0.5Z"
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

        <!-- 贊助商 icon  -->
        <div class="absolute left-1/2 top-1/2 grid max-w-[809px] -translate-x-1/2 -translate-y-1/2 grid-cols-3 place-items-center gap-y-[80px]">
          <a
            v-for="sponsor in SPONSORS"
            :key="sponsor.name"
            :href="sponsor.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <NuxtImg
              :src="sponsor.src"
              :width="sponsor.width"
              :height="sponsor.height"
              :alt="sponsor.name"
            />
          </a>
        </div>
      </div>

      <!-- 背景 vite icon x2  -->
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute left-[238px] top-[81px]"
      />
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[145px] top-[87px]"
      />
    </div>
  </section>
</template>
