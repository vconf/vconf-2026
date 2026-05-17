<script setup lang="ts">
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const { gsap } = useGsap()

const vueIcon1Ref = ref<SVGImageElement | null>(null)
const vueIcon2Ref = ref<SVGImageElement | null>(null)
const vueIcon3Ref = ref<SVGImageElement | null>(null)

const viteIcon1Ref = ref<SVGImageElement | null>(null)
const viteIcon2Ref = ref<SVGImageElement | null>(null)

const bigPathRef = ref<SVGPathElement | null>(null)
const smallPathRef = ref<SVGPathElement | null>(null)

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
      autoRotate: false,
      start,
      end: start + 1,
    },
  })
}

onMounted(() => {
  gsap.registerPlugin(MotionPathPlugin)

  if (
    !bigPathRef.value
    || !smallPathRef.value
    || !vueIcon1Ref.value
    || !vueIcon2Ref.value
    || !vueIcon3Ref.value
    || !viteIcon1Ref.value
    || !viteIcon2Ref.value
  ) {
    return
  }

  activeTweens.push(
    createOrbitTween(vueIcon1Ref.value, bigPathRef.value, 0, 18),
    createOrbitTween(vueIcon2Ref.value, bigPathRef.value, 0.33, 18),
    createOrbitTween(vueIcon3Ref.value, bigPathRef.value, 0.66, 18),
    createOrbitTween(viteIcon1Ref.value, smallPathRef.value, 0.15, 12),
    createOrbitTween(viteIcon2Ref.value, smallPathRef.value, 0.65, 12),
  )
})

onBeforeUnmount(() => {
  activeTweens.forEach(tween => tween.kill())
})
</script>

<template>
  <section class="container flex w-full gap-6 overflow-hidden pt-[60px]">
    <svg
      class="ml-[-40px] w-[620px] shrink-0 lg:w-[700px] xl:w-[700px]"
      viewBox="-80 0 700 980"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(24 24)">
        <path
          ref="bigPathRef"
          d="M75.4427 13.5798C129.265 -15.0273 202.354 4.59301 277.118 59.7712C351.849 114.925 428.099 205.505 488.129 318.447C548.158 431.389 580.577 545.265 584.484 638.064C588.391 730.902 563.764 802.459 509.942 831.066C456.119 859.673 383.031 840.052 308.267 784.874C233.536 729.72 157.285 639.14 97.256 526.198C37.2268 413.256 4.80787 299.38 0.901637 206.582C-3.00625 113.743 21.6203 42.187 75.4427 13.5798Z"
          fill="none"
          stroke="#CACACA"
          stroke-width="1"
        />

        <image
          ref="vueIcon1Ref"
          href="/home/vue-icon.svg"
          width="21"
          height="20"
        />
        <image
          ref="vueIcon2Ref"
          href="/home/vue-icon.svg"
          width="21"
          height="20"
        />
        <image
          ref="vueIcon3Ref"
          href="/home/vue-icon.svg"
          width="21"
          height="20"
        />
      </g>

      <g transform="translate(-58 360)">
        <path
          ref="smallPathRef"
          d="M353.374 25.2262C474.552 88.0264 514.888 250.889 443.284 389.053C371.681 527.217 215.358 588.16 94.1808 525.36C-26.9968 462.56 -67.3325 299.699 4.27061 161.535C75.874 23.3704 232.197 -37.5739 353.374 25.2262Z"
          fill="none"
          stroke="#CACACA"
          stroke-width="1"
        />

        <image
          ref="viteIcon1Ref"
          href="/home/vite-icon.svg"
          width="16"
          height="15"
        />
        <image
          ref="viteIcon2Ref"
          href="/home/vite-icon.svg"
          width="16"
          height="15"
        />
      </g>
    </svg>
    <div class="relative ml-[-450px] pt-[92px] font-serif text-[21px] text-vconf-text-read">
      <div class="max-w-[542px] bg-vconf-section-bg px-6 py-8 font-bold">
        <h2 class="mb-6 text-[48px] font-bold text-vconf-heading">
          <span class="pr-6">(</span>
          <span class="pr-6">行為準則</span>
          <span>)</span>
        </h2>
        <p class="text-[21px] font-medium leading-[160%] tracking-[0.02em]">
          <span class="text-vconf-primary">V-CONF Taiwan 2026 </span>
          <span>致力於為所有與會者，包括講者、贊助商與工作人員，提供一個安全、無騷擾且相互尊重的活動環境。</span>
        </p>
      </div>
      <div class="ml-[430px] mt-[15px] flex max-w-[677px] flex-col gap-12">
        <div class="relative  border border-vconf-gray-light p-6 leading-[160%] tracking-[0.02em]">
          <p>我們堅決反對任何形式的騷擾行為，包括但不限於涉及性別、年齡、種族、宗教、身體外貌或性取向的冒犯性言論，以及跟蹤、不當肢體接觸或未受歡迎的性暗示等行為。</p>
          <NuxtImg
            width="713"
            height="173"
            class="absolute right-[-85px] top-[-30px] max-w-none"
            src="/home/icon-bg.png"
            loading="eager"
            placeholder
          />
        </div>

        <div class="relative translate-x-[42px] border border-vconf-gray-light p-6 leading-[160%] tracking-[0.02em]">
          <p>所有參與者皆須同意並遵守本行為準則。若發生違規情形，主辦單位有權採取相應措施，包括警告或要求離場，且不予退費。</p>
          <NuxtImg
            width="713"
            height="138"
            class="absolute right-[-85px] top-[-30px] max-w-none"
            src="/home/icon-bg-2.png"
            loading="eager"
            placeholder
          />
        </div>

        <div class="relative translate-x-[10px] border border-vconf-gray-light p-6 leading-[160%] tracking-[0.02em]">
          <p>若您遭受騷擾，或目睹他人遭受不當對待，請立即聯繫工作人員。我們將盡全力提供協助，確保每一位參與者都能安心參與活動。</p>
          <NuxtImg
            width="713"
            height="138"
            class="absolute right-[-80px] top-[-30px] max-w-none"
            src="/home/icon-bg-2.png"
            loading="eager"
            placeholder
          />
        </div>
      </div>
      <div class="ml-[352px] mt-10 max-w-[677px] translate-x-[-130px]">
        <p class="text-center text-[16px] font-normal leading-[150%] tracking-[0.02em] text-vconf-primary">
          感謝您的配合與支持，讓我們共同打造開放、包容且充滿活力的 Vue.js 社群。
        </p>
      </div>
    </div>
  </section>
</template>
