<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { gsap } = useGsap()

const vueIcon1Ref = ref<SVGImageElement | null>(null)
const vueIcon2Ref = ref<SVGImageElement | null>(null)
const vueIcon3Ref = ref<SVGImageElement | null>(null)

const viteIcon1Ref = ref<SVGImageElement | null>(null)
const viteIcon2Ref = ref<SVGImageElement | null>(null)
const mobileViteLargeRef = ref<SVGImageElement | null>(null)
const mobileViteSmallRef = ref<SVGImageElement | null>(null)

const bigPathRef = ref<SVGPathElement | null>(null)
const smallPathRef = ref<SVGPathElement | null>(null)
const mobilePathRef = ref<SVGPathElement | null>(null)

const activeTweens: Array<{ kill: () => void }> = []
const breakpoints = useBreakpoints({
  md: 768,
})
const isMdUp = breakpoints.greaterOrEqual('md')

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

function clearActiveTweens() {
  activeTweens.forEach(tween => tween.kill())
  activeTweens.length = 0
}

function initDesktopTweens() {
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
}

function initMobileTweens() {
  if (!mobilePathRef.value || !mobileViteLargeRef.value || !mobileViteSmallRef.value)
    return

  activeTweens.push(
    createOrbitTween(mobileViteLargeRef.value, mobilePathRef.value, 0.12, 9),
    createOrbitTween(mobileViteSmallRef.value, mobilePathRef.value, 0.62, 11),
  )
}

function syncOrbitTweensByViewport(mdUp: boolean) {
  clearActiveTweens()

  if (mdUp) {
    initDesktopTweens()
    return
  }

  initMobileTweens()
}

onMounted(() => {
  gsap.registerPlugin(MotionPathPlugin)
  syncOrbitTweensByViewport(isMdUp.value)
})

watch(isMdUp, async (mdUp) => {
  await nextTick()
  syncOrbitTweensByViewport(mdUp)
}, { flush: 'post' })

onBeforeUnmount(() => {
  clearActiveTweens()
})
</script>

<template>
  <section class="relative isolate mt-[99px] md:mt-[64px] xl:mt-[99px]">
    <!-- 主要內容 -->
    <div class="container relative z-10 flex w-full justify-center gap-6 px-6 md:items-start md:px-0">
      <svg
        class="ml-[clamp(-610px,calc(-610px+150*((100vw-768px)/256)),-460px)] hidden w-[620px] shrink-0 md:block lg:ml-[clamp(-390px,calc(-390px+140*((100vw-1024px)/256)),-250px)] xl:ml-[clamp(-340px,calc(-340px+210*((100vw-1280px)/256)),-130px)] 2xl:ml-[-30px]"
        viewBox="-10 0 620 920"
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
            href="/about/vue-icon.svg"
            width="21"
            height="20"
          />
          <image
            ref="vueIcon2Ref"
            href="/about/vue-icon.svg"
            width="21"
            height="20"
          />
          <image
            ref="vueIcon3Ref"
            href="/about/vue-icon.svg"
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
            href="/share/vite-icon.svg"
            width="16"
            height="15"
          />
          <image
            ref="viteIcon2Ref"
            href="/share/vite-icon.svg"
            width="16"
            height="15"
          />
        </g>
      </svg>
      <div class="relative ml-0 pt-[92px] font-serif text-[16px] text-vconf-text-read md:ml-[-420px] md:text-[21px] xl:ml-[-450px]">
        <div
          class="pointer-events-none absolute left-1/2 top-[58px] h-[269px] w-[388px] -translate-x-1/2 md:hidden"
          aria-hidden="true"
        >
          <svg
            class="size-full"
            viewBox="-8 -8 388 273"
            xmlns="http://www.w3.org/2000/svg"
          >
            <image
              href="/about/ellipse-sm.svg"
              x="0"
              y="0"
              width="372"
              height="257"
            />
            <path
              ref="mobilePathRef"
              d="M90.0093 1.01172C49.3506 -1.90744 18.2615 7.65039 6.00635 30.0742C-6.24873 52.4981 2.49531 83.8257 26.9087 116.47C51.293 149.075 91.1937 182.821 140.84 209.954C190.487 237.087 240.437 252.446 281.047 255.361C321.706 258.28 352.795 248.723 365.05 226.299C377.305 203.875 368.561 172.547 344.148 139.903C319.764 107.298 279.862 73.5518 230.215 46.4189C180.569 19.2862 130.619 3.92743 90.0093 1.01172Z"
              fill="none"
              stroke="none"
            />
            <image
              ref="mobileViteLargeRef"
              href="/share/vite-icon.svg"
              width="16"
              height="15"
            />
            <image
              ref="mobileViteSmallRef"
              href="/share/vite-icon.svg"
              width="8"
              height="8"
            />
          </svg>
        </div>
        <!-- 標題 -->
        <div class="z-1 relative mb-[47px] max-w-[354px] translate-x-0 bg-vconf-section-bg p-6 font-bold md:mb-0 md:max-w-[542px] md:translate-x-[250px] md:py-8 lg:translate-x-0">
          <ShareSectionTitle
            title="行為準則"
            :margin-bottom="24"
          />
          <p class="text-[16px] font-medium leading-[160%] tracking-[0.02em] md:text-[21px]">
            <span class="text-vconf-primary">V-CONF Taiwan 2026 </span>
            <span>是致力於為所有與會者，包括講者、贊助商與工作人員，提供一個安全、無騷擾且相互尊重的活動環境。</span>
          </p>
        </div>
        <!-- 行為準則三條內容 -->
        <div class="mx:m-0 mx-auto mt-[15px] flex max-w-[307px] flex-col gap-9 md:ml-[400px] md:max-w-[475px] md:gap-12 xl:ml-[430px] xl:max-w-[677px]">
          <div class="flex items-center">
            <NuxtImg
              width="15"
              height="14"
              class="mr-2 block h-[14px] w-[15px] min-w-[15px] shrink-0 md:hidden"
              src="/about/vue-icon.svg"
              loading="eager"
              placeholder
            />
            <div class="relative min-w-0 flex-1 p-3 leading-[160%] tracking-[0.01em] before:pointer-events-none before:absolute before:inset-0 before:border before:border-vconf-gray-light before:content-[''] md:p-6 md:tracking-[0.02em]">
              <p>我們堅決反對任何形式的騷擾行為，包括但不限於涉及性別、年齡、種族、宗教、身體外貌或性取向的冒犯性言論，以及跟蹤、不當肢體接觸或未受歡迎的性暗示等行為。</p>
              <NuxtImg
                width="713"
                height="173"
                class="absolute right-[-85px] top-[-30px] hidden max-w-none xl:block"
                src="/about/icon-bg.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="549"
                height="173"
                class="absolute right-[-85px] top-[-30px] hidden max-w-none md:block xl:hidden"
                src="/about/icon-bg-md.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="312"
                height="137"
                class="absolute right-[-34px] top-[-15px] block max-w-none md:hidden"
                src="/about/icon-bg-sm.png"
                loading="eager"
                placeholder
              />
            </div>
          </div>

          <div class="flex items-center">
            <NuxtImg
              width="15"
              height="14"
              class="mr-2 block h-[14px] w-[15px] min-w-[15px] shrink-0 md:hidden"
              src="/about/vue-icon.svg"
              loading="eager"
              placeholder
            />
            <div class="relative min-w-0 flex-1 translate-x-0 p-3 leading-[160%] tracking-[0.02em] before:pointer-events-none before:absolute before:inset-0 before:border before:border-vconf-gray-light before:content-[''] md:translate-x-[42px] md:p-6">
              <p>所有參與者皆須同意並遵守本行為準則。若發生違規情形，主辦單位有權採取相應措施，包括警告或要求離場，且不予退費。</p>
              <NuxtImg
                width="713"
                height="138"
                class="absolute right-[-85px] top-[-30px] hidden max-w-none xl:block"
                src="/about/icon-bg-2.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="549"
                height="138"
                class="absolute right-[-85px] top-[-30px] hidden max-w-none md:block xl:hidden"
                src="/about/icon-bg-md-2.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="312"
                height="119"
                class="absolute right-[-34px] top-[-15px] block max-w-none md:hidden"
                src="/about/icon-bg-sm-2.png"
                loading="eager"
                placeholder
              />
            </div>
          </div>

          <div class="flex items-center">
            <NuxtImg
              width="15"
              height="14"
              class="mr-2 block h-[14px] w-[15px] min-w-[15px] shrink-0 md:hidden"
              src="/about/vue-icon.svg"
              loading="eager"
              placeholder
            />
            <div class="relative min-w-0 flex-1 translate-x-0 p-3 leading-[160%] tracking-[0.02em] before:pointer-events-none before:absolute before:inset-0 before:border before:border-vconf-gray-light before:content-[''] md:translate-x-[10px] md:p-6 md:tracking-[0.02em]">
              <p>若您遭受騷擾，或目睹他人遭受不當對待，請立即聯繫工作人員。我們將盡全力提供協助，確保每一位參與者都能安心參與活動。</p>
              <NuxtImg
                width="713"
                height="138"
                class="absolute right-[-75px] top-[-30px] hidden max-w-none xl:block"
                src="/about/icon-bg-2.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="549"
                height="138"
                class="absolute right-[-75px] top-[-30px] hidden max-w-none md:block xl:hidden"
                src="/about/icon-bg-md-2.png"
                loading="eager"
                placeholder
              />
              <NuxtImg
                width="312"
                height="119"
                class="absolute right-[-34px] top-[-15px] block max-w-none md:hidden"
                src="/about/icon-bg-sm-2.png"
                loading="eager"
                placeholder
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 裝飾 vite icon 背景 -->
      <!-- 右側 -->
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[513px] top-[-42px]"
      />
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[313px] top-0"
      />
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[313px] top-[59px]"
      />
      <NuxtImg
        src="/share/vite-icon.svg"
        width="16"
        height="15"
        class="absolute right-[313px] top-[182px]"
      />
    </div>
    <!-- 感謝語 -->
    <div class="container relative z-10 mt-[42px] hidden place-content-center font-serif md:grid xl:mt-0">
      <p class="w-fit max-w-[677px] text-center text-[16px] font-normal leading-[150%] tracking-[0.02em] text-vconf-primary">
        感謝您的配合與支持，讓我們共同打造開放、包容且充滿活力的 Vue.js 社群。
      </p>
    </div>
  </section>
</template>

<style scoped>
.section-bg-layer {
  overflow-x: clip;
  overflow-y: visible;
}

.section-bg {
  transform: translate(66.8%, -49.5%) rotate(-5deg);
  pointer-events: none;
  user-select: none;
}

@media (min-width: 769px){
  .section-bg {
    transform: translate(69.8%, -42.5%) rotate(-5deg);
  }
}

@media (min-width: 1025px){
  .section-bg {
    transform: translate(56.8%, -38.5%) rotate(-5deg)
  }
}
</style>
