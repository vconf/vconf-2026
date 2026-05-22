<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const CONTACT_EMAIL = 'vuejs_taiwan@googlegroups.com'
const EVENT_DATE = '2026.10.31'
const EVENT_DATE_TIME = '2026-10-31'
const EVENT_START_TIME = '09:30'
const EVENT_END_TIME = '16:00'
const VENUE_NAME = '政大公企中心 A2 國際會議廳'
const MAP_ADDRESS = '106臺北市大安區金華街187號'
const MAP_LINK = 'https://www.google.com/maps/place/106%E8%87%BA%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80%E6%B0%B8%E5%BA%B7%E9%87%8C%E9%87%91%E8%8F%AF%E8%A1%97187%E8%99%9F/data=!4m2!3m1!1s0x3442a9836e26dc93:0xa633d1d75abd7053?sa=X&ved=1t:242&ictx=111'
const SOCIAL_LINKS = [
  {
    LABEL: 'Facebook',
    HREF: 'https://www.facebook.com/groups/vuejs.tw',
    ICON: '/home/fb.svg',
    WIDTH: '28',
    HEIGHT: '45',
  },
  {
    LABEL: 'Threads',
    HREF: 'https://www.threads.com/@vuejs_taiwan',
    ICON: '/home/thread.svg',
    WIDTH: '43',
    HEIGHT: '53',
  },
  {
    LABEL: 'Instagram',
    HREF: 'https://www.instagram.com/vuejs_taiwan',
    ICON: '/home/ig.svg',
    WIDTH: '50',
    HEIGHT: '50',
  },
] as const

const airplaneTriggerRef = ref<HTMLElement | null>(null)
const airplaneStarted = ref(false)

const { stop } = useIntersectionObserver(
  airplaneTriggerRef,
  ([entry]) => {
    if (!entry?.isIntersecting || airplaneStarted.value)
      return

    airplaneStarted.value = true
    stop()
  },
  {
    threshold: 0.35,
  },
)
</script>

<template>
  <footer class="overflow-hidden pb-[31px] pt-[68px]">
    <div class="container relative mb-[220px] max-w-[891px]">
      <!-- 主標題 -->
      <h2 class="mb-8 flex items-center justify-center whitespace-nowrap text-center font-serif text-[clamp(28px,5.2vw,64px)] font-bold leading-[1.2] text-vconf-heading xs:text-[64px]">
        <span class="translate-y-[2px] pr-2 text-[32px] lg:pr-6">(</span>
        <span class="pr-2 lg:pr-6">Information</span>
        <span class="translate-y-[2px] text-[32px]">)</span>
      </h2>
      <!-- 內文 -->
      <div class="flex flex-col items-center gap-4 pb-[98px] font-serif">
        <p class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read">
          日期
        </p>
        <time
          class="text-[24px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary"
          :datetime="EVENT_DATE_TIME"
        >{{ EVENT_DATE }}</time>
        <p class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read">
          時間
        </p>
        <p class="text-[24px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary">
          <time :datetime="EVENT_START_TIME">{{ EVENT_START_TIME }}</time>
          <span aria-hidden="true"> ─ </span>
          <time :datetime="EVENT_END_TIME">{{ EVENT_END_TIME }}</time>
        </p>
        <p class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read">
          地點
        </p>
        <address>
          <p class="mb-4 text-[24px] font-bold not-italic leading-[1.6] tracking-[0.02em] text-vconf-primary">
            {{ VENUE_NAME }}
          </p>
          <a
            :href="MAP_LINK"
            target="_blank"
            rel="noopener noreferrer"
            class="relative isolate m-auto flex w-fit items-center gap-4 rounded-full px-5 py-3 before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-vconf-primary before:content-['']"
          >
            <p class="text-[16px] not-italic tracking-[0.01em] text-vconf-primary">
              {{ MAP_ADDRESS }}
            </p>
            <NuxtImg
              width="21"
              height="29"
              src="/home/map.svg"
              placeholder
            />
          </a>
        </address>
        <p class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read">
          聯絡信箱
        </p>
        <a
          :href="`mailto:${CONTACT_EMAIL}`"
          class="text-[24px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary"
        >
          {{ CONTACT_EMAIL }}
        </a>
        <p class="text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read">
          關注 VCONF 2026
        </p>
        <!-- social icon -->
        <div class="flex items-center gap-[59px]">
          <a
            v-for="socialLink in SOCIAL_LINKS"
            :key="socialLink.LABEL"
            :href="socialLink.HREF"
            :aria-label="socialLink.LABEL"
            target="_blank"
            rel="noopener noreferrer"
          >
            <NuxtImg
              :src="socialLink.ICON"
              :width="socialLink.WIDTH"
              :height="socialLink.HEIGHT"
              placeholder
            />
          </a>
        </div>
      </div>
      <!-- 飛行軌道背景 -->
      <NuxtImg
        src="/home/fly-bg.png"
        width="891"
        height="418"
        placeholder
        class="absolute bottom-[-39%] left-[9%] z-0"
      />
      <div
        ref="airplaneTriggerRef"
        class="absolute bottom-[20%] left-[-3%] z-10 aspect-[265/291] w-[191px]"
      >
        <ShareFooterAirplane
          :started="airplaneStarted"
          class="pointer-events-none absolute inset-0 size-full"
        />
      </div>
    </div>
    <!-- 底部背景圖 -->
    <div class="relative bottom-0 left-0 mx-5 overflow-hidden pb-[143px]">
      <div
        class="footer-bg pointer-events-none absolute inset-x-0 bottom-0"
        aria-hidden="true"
      ></div>
    </div>
  </footer>
</template>

<style scoped>
.footer-bg {
  padding-top: 520px;
  background-image: url('/home/vite-icon-large.svg');
  background-repeat: repeat;
  background-size: 36px 35px;
}
</style>
