<script setup lang="ts">
import {
  useBreakpoints,
  useIntersectionObserver,
  useResizeObserver,
  useWindowSize,
} from '@vueuse/core'

const CONTACT_EMAIL = 'vuejs_taiwan@googlegroups.com'
const EVENT_DATE = '2026.10.17'
const EVENT_DATE_TIME = '2026-10-17'
const EVENT_START_TIME = '09:30'
const EVENT_END_TIME = '16:00'
const VENUE_NAME = '政大公企中心 A2 國際會議廳'
const MAP_ADDRESS = '106臺北市大安區金華街187號'
const MAP_LINK
  = 'https://www.google.com/maps/place/106%E8%87%BA%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80%E6%B0%B8%E5%BA%B7%E9%87%8C%E9%87%91%E8%8F%AF%E8%A1%97187%E8%99%9F/data=!4m2!3m1!1s0x3442a9836e26dc93:0xa633d1d75abd7053?sa=X&ved=1t:242&ictx=111'
const SOCIAL_LINKS = [
  {
    LABEL: 'Facebook',
    HREF: 'https://www.facebook.com/groups/vuejs.tw',
    ICON: '/share/fb.svg',
    WIDTH: '28',
    HEIGHT: '45',
    SIZE_CLASS: 'w-[25px] h-[40px] md:w-[28px] md:h-[45px]',
  },
  {
    LABEL: 'Threads',
    HREF: 'https://www.threads.com/@vuejs_taiwan',
    ICON: '/share/thread.svg',
    WIDTH: '43',
    HEIGHT: '53',
    SIZE_CLASS: 'w-[33px] h-[40px] md:w-[43px] md:h-[53px]',
  },
  {
    LABEL: 'Instagram',
    HREF: 'https://www.instagram.com/vuejs_taiwan',
    ICON: '/share/ig.svg',
    WIDTH: '50',
    HEIGHT: '50',
    SIZE_CLASS: 'w-[40px] h-[40px] md:w-[50px] md:h-[50px]',
  },
] as const

const footerBgRef = ref<HTMLElement | null>(null)

const TILE_W = 36
const TILE_H = 35
const TILE_W_XS = 20
const TILE_H_XS = 19
const MD_BREAKPOINT = 768

const { width: viewportWidth } = useWindowSize()
const tileSizeStyle = ref<{ backgroundSize: string }>({
  backgroundSize: `${TILE_W}px ${TILE_H}px`,
})

useResizeObserver(footerBgRef, ([entry]) => {
  const { width, height } = entry.contentRect
  if (width <= 0 || height <= 0)
    return
  const isSmall = viewportWidth.value < MD_BREAKPOINT
  const tileW = isSmall ? TILE_W_XS : TILE_W
  const tileH = isSmall ? TILE_H_XS : TILE_H
  const cols = Math.round(width / tileW)
  const rows = Math.round(height / tileH)
  tileSizeStyle.value = {
    backgroundSize: `${width / cols}px ${height / rows}px`,
  }
})

const airplaneTriggerRef = ref<HTMLElement | null>(null)
const airplaneTriggerMobileRef = ref<HTMLElement | null>(null)
const airplaneStarted = ref(false)

const breakpoints = useBreakpoints({ md: MD_BREAKPOINT })
const isDesktop = breakpoints.greaterOrEqual('md')
const activeAirplaneTrigger = computed(() =>
  isDesktop.value ? airplaneTriggerRef.value : airplaneTriggerMobileRef.value,
)

const { stop } = useIntersectionObserver(
  activeAirplaneTrigger,
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
  <footer class="overflow-hidden pb-[13px] pt-[99px] md:pb-[31px]">
    <div class="container relative mb-[130px] max-w-[891px] md:mb-[220px]">
      <div class="relative m-auto w-fit">
        <ShareSectionTitle title="Information" />
        <!-- 內文 -->
        <div
          class="relative m-auto flex w-fit flex-col items-center gap-3 pb-0 font-serif md:gap-4 md:pb-[98px]"
        >
          <p
            class="text-[14px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[18px]"
          >
            日期
          </p>
          <time
            class="text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[24px]"
            :datetime="EVENT_DATE_TIME"
          >{{ EVENT_DATE }}</time>
          <p
            class="text-[14px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[18px]"
          >
            時間
          </p>
          <p
            class="text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[24px]"
          >
            <time :datetime="EVENT_START_TIME">{{ EVENT_START_TIME }}</time>
            <span aria-hidden="true"> ─ </span>
            <time :datetime="EVENT_END_TIME">{{ EVENT_END_TIME }}</time>
          </p>
          <p
            class="text-[14px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[18px]"
          >
            地點
          </p>
          <address class="text-center">
            <p
              class="mb-4 text-[16px] font-bold not-italic leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[24px]"
            >
              {{ VENUE_NAME }}
            </p>
            <a
              :href="MAP_LINK"
              target="_blank"
              rel="noopener noreferrer"
              class="relative isolate m-auto flex w-fit items-center gap-4 rounded-full px-5 py-3 before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-vconf-primary before:content-['']"
            >
              <p
                class="text-[16px] not-italic leading-[1.6] tracking-[0.02em] text-vconf-primary"
              >
                {{ MAP_ADDRESS }}
              </p>
              <NuxtImg
                width="21"
                height="29"
                src="/share/map.svg"
                alt=""
                placeholder
              />
            </a>
          </address>
          <p
            class="text-[14px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[18px]"
          >
            聯絡信箱
          </p>
          <a
            :href="`mailto:${CONTACT_EMAIL}`"
            class="text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:text-[24px]"
          >
            {{ CONTACT_EMAIL }}
          </a>
          <p
            class="text-[14px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:text-[18px]"
          >
            關注 VCONF 2026
          </p>
          <!-- social icon -->
          <div class="flex items-center gap-8 md:gap-[59px]">
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
                alt=""
                :width="socialLink.WIDTH"
                :height="socialLink.HEIGHT"
                :class="socialLink.SIZE_CLASS"
                placeholder
              />
            </a>
          </div>
        </div>

        <!-- 手機版裝飾 -->
        <!-- 左半部 -->
        <NuxtImg
          class="absolute left-[-24px] top-[253px] block md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[271px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[301px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[331px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[361px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[391px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[426px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute left-[-36px] top-[452px] block xs:left-[-42px] md:hidden"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />

        <!-- 右半部 -->
        <div
          ref="airplaneTriggerMobileRef"
          class="absolute right-[-40px] top-[40px] z-10 block aspect-[265/291] w-[72px] xs:right-[-55px] xs:top-[60px] md:hidden lg:right-[-40px] lg:top-[40px]"
        >
          <ShareFooterAirplane
            :started="airplaneStarted"
            class="pointer-events-none absolute inset-0 size-full"
          />
        </div>
        <NuxtImg
          class="absolute right-[-16px] top-[228px] block xs:top-[248px] md:hidden lg:top-[228px]"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute right-[-29px] top-[202px] block xs:top-[222px] md:hidden lg:top-[202px]"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute right-[-29px] top-[178px] block xs:top-[198px] md:hidden lg:top-[178px]"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute right-[-29px] top-[154px] block xs:top-[174px] md:hidden lg:top-[154px]"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <NuxtImg
          class="absolute right-[-29px] top-[130px] block xs:top-[150px] md:hidden lg:top-[130px]"
          alt=""
          width="8"
          height="8"
          src="/share/vite-icon-small.svg"
        />
        <!-- 桌機裝飾背景 vite icon -->
        <!-- 右邊 icon 背景 -->
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute right-[-235px] top-[-15px] hidden lg:block"
        />
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute right-[-83px] top-[54px] hidden lg:block"
        />
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute right-[-235px] top-[416px] hidden md:right-[-165px] md:block lg:right-[-235px]"
        />
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute right-[-193px] top-[280px] hidden md:right-[-123px] md:block lg:right-[-193px]"
        />
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute bottom-[160px] right-[-180px] hidden lg:block"
        />
        <!-- 左邊 icon 背景 -->
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute left-[-225px] top-[98px] hidden lg:block"
        />
        <NuxtImg
          src="/share/vite-icon.svg"
          alt=""
          width="16"
          height="15"
          class="absolute left-[-280px] top-[190px] hidden lg:block"
        />
      </div>
      <!-- 飛行軌道背景 -->
      <NuxtImg
        src="/share/fly-bg.png"
        alt=""
        width="891"
        height="418"
        sizes="480px md:891px"
        placeholder
        class="absolute bottom-[-265px] right-[-80px] z-[-1] hidden max-w-none md:right-[-180px] md:block lg:right-[-80px]"
      />
      <NuxtImg
        src="/share/fly-bg-sm.png"
        alt=""
        width="405"
        height="184"
        placeholder
        class="absolute bottom-[-186px] right-[-4px] z-[-1] block max-w-none md:hidden"
      />
      <!-- 飛機圖示 -->
      <div
        ref="airplaneTriggerRef"
        class="absolute bottom-[158px] left-[-27px] z-10 hidden aspect-[265/291] w-[191px] md:left-[15px] md:block lg:left-[-27px]"
      >
        <ShareFooterAirplane
          :started="airplaneStarted"
          class="pointer-events-none absolute inset-0 size-full"
        />
      </div>
    </div>
    <!-- 底部背景圖 -->
    <div
      class="relative bottom-0 left-0 mx-4 overflow-hidden pb-[76px] md:mx-5 md:pb-[143px]"
    >
      <div
        ref="footerBgRef"
        class="footer-bg pointer-events-none absolute inset-x-0 bottom-0"
        :style="tileSizeStyle"
        aria-hidden="true"
      ></div>
      <p
        class="absolute bottom-0 right-0 bg-vconf-white px-1 font-serif text-[12px] leading-[1.6] tracking-[0.02em] text-vconf-primary md:bottom-[10px] md:px-3 md:text-[14px]"
      >
        © V-CONF Taiwan 2026
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-bg {
  height: 76px;
  background-image: url("/share/vite-icon-large.svg");
  background-repeat: repeat;
  background-size: auto;
}

@media (min-width: 768px) {
  .footer-bg {
    height: 143px;
  }
}
</style>
