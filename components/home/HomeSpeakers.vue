<script setup lang="ts">
import type { AnySpeaker } from '~/utils/agenda'
import { useResizeObserver } from '@vueuse/core'
import { createSpeakerCards } from '~/utils/speakerCards'

const { data: speakers } = await useSpeakers()
const {
  preloadAgendaTalk,
  preloadModalBackground,
  preloadSpeakerModal,
  cardPhotoUrl,
} = useSpeakerImages()
const { reserve: reserveAd } = useAdSlot()

// Talk 1 還沒公開時，第一張會是不可點的神秘 keynote 卡
const cards = computed(() => createSpeakerCards(speakers.value ?? []))
// loop 模式要有足夠的 slide 才不會出現空隙，所以整份卡片清單重複一次
const DISPLAY_CARDS = computed(() => [...cards.value, ...cards.value])

const SWIPER_OPTIONS = {
  loop: true,
  centeredSlides: true,
  slidesPerView: 1.35,
  initialSlide: 1,
  speed: 600,
  grabCursor: true,
  autoplay: {
    delay: 2800,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  breakpoints: {
    1024: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
    },
  },
  effect: 'coverflow',
  coverflowEffect: {
    rotate: 10,
    stretch: -28,
    depth: 100,
    modifier: 1.05,
    slideShadows: false,
  },
}

const swiperRef = ref<(HTMLElement & { initialize: () => void }) | null>(null)
const swiperWrapperRef = ref<HTMLElement | null>(null)

/**
 * 卡片連到議程彈窗，議程彈窗的講者照與廣告先抓，與 AgendaList 一致。
 * 講者彈窗（/speakers/[talkSlug]）是接著最可能去的地方，
 * 但不該跟真正的目的地搶頻寬，所以等議程那張結束後才用 low 補上。
 */
function warmSpeaker(speaker: AnySpeaker) {
  void reserveAd()
  void preloadAgendaTalk(speaker, 'high').then(() => {
    void preloadModalBackground('low')
    void preloadSpeakerModal(speaker, 'low')
  })
}

function ensureSwiperInitialized() {
  const el = swiperRef.value

  if (!el?.isConnected || !swiperWrapperRef.value?.clientWidth)
    return

  el.initialize()
}

onMounted(() => nextTick(ensureSwiperInitialized))
useResizeObserver(swiperWrapperRef, ensureSwiperInitialized)
</script>

<template>
  <section
    class="relative isolate overflow-visible pb-[80px] pt-[99px] md:pb-0"
  >
    <div class="container relative z-10">
      <!-- 標題 -->
      <ShareSectionTitle
        title="Speakers"
        :margin-bottom="-85"
      />

      <!-- 主要內容 -->
      <div
        class="mx-auto flex min-h-[421px] items-center justify-center overflow-visible md:h-[842px] md:min-h-0 xl:max-w-[1397px]"
      >
        <NuxtImg
          src="/home/speakers-bg-left.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="220"
          height="842"
          class="pointer-events-none z-20 mr-[-60px] hidden shrink-0 xl:block"
        />

        <NuxtImg
          src="/home/speakers-bg-left-md.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="191"
          height="842"
          class="pointer-events-none z-20 mr-[-80px] hidden shrink-0 md:block xl:hidden"
        />

        <NuxtImg
          src="/home/speakers-bg-left-sm.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="93"
          height="421"
          class="pointer-events-none z-20 mr-[-24px] block shrink-0 md:hidden"
        />

        <div
          class="relative z-10 min-w-0 flex-1 translate-y-[80px] pb-[78px] md:translate-y-0 md:pb-[124px]"
        >
          <!-- 輪播卡片 -->
          <ClientOnly>
            <div
              ref="swiperWrapperRef"
              class="relative flex min-w-0 items-center before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-gradient-to-r before:from-vconf-white before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-gradient-to-l after:from-vconf-white after:to-transparent after:content-[''] md:h-full"
            >
              <swiper-container
                ref="swiperRef"
                v-bind="SWIPER_OPTIONS"
                :init="false"
                data-swiper="speakers"
                class="mx-auto grid place-content-center md:h-full"
              >
                <swiper-slide
                  v-for="(card, index) in DISPLAY_CARDS"
                  :key="`${card.key}-${index}`"
                  class="speaker-slide flex justify-center md:h-full"
                >
                  <div class="flex w-full max-w-[228px] flex-col md:max-w-none">
                    <!-- 未公開的 keynote：模糊照片 + 神秘講者，刻意不可點 -->
                    <ShareMysterySilhouette
                      v-if="card.kind === 'mystery'"
                      tone="duo"
                      class="speaker-card-frame aspect-speaker-card w-full min-w-0"
                    />
                    <NuxtLink
                      v-else
                      :to="`/agenda/${card.speaker.talkSlug}`"
                      :aria-label="`查看 ${card.speaker.name} 的議程資訊`"
                      class="block w-full min-w-0"
                      @mouseenter="warmSpeaker(card.speaker)"
                      @focus="warmSpeaker(card.speaker)"
                      @touchstart.passive="warmSpeaker(card.speaker)"
                    >
                      <svg
                        data-speaker-image-frame
                        viewBox="0 0 267 374"
                        xmlns="http://www.w3.org/2000/svg"
                        class="aspect-speaker-card w-full min-w-0"
                        aria-hidden="true"
                      >
                        <defs>
                          <clipPath
                            :id="`speaker-mask-${index}`"
                            clipPathUnits="userSpaceOnUse"
                          >
                            <path d="M4 28.8947L263 0V366L4 313.026V28.8947Z" />
                          </clipPath>
                        </defs>
                        <image
                          :href="cardPhotoUrl(card.speaker)"
                          x="0"
                          y="0"
                          width="267"
                          height="374"
                          preserveAspectRatio="xMidYMid slice"
                          :clip-path="`url(#speaker-mask-${index})`"
                        />
                      </svg>
                    </NuxtLink>
                    <div class="flex-1 px-6 pt-4 text-center md:px-[45px]">
                      <h3
                        class="mb-[14px] flex items-center justify-center font-serif text-[20px] font-bold leading-[1.2] tracking-[0%] md:text-[24px]"
                      >
                        <span
                          class="pr-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light"
                        >{</span>
                        <span class="text-vconf-primary">{{ card.name }}</span>
                        <span
                          class="pl-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light"
                        >}</span>
                      </h3>
                      <p
                        class="font-serif text-[16px] leading-[1.6] tracking-[0%] text-vconf-text-read"
                      >
                        {{ card.jobTitle }}
                      </p>
                    </div>
                  </div>
                </swiper-slide>
              </swiper-container>
            </div>
          </ClientOnly>

          <!-- 全部講者按鈕 -->
          <NuxtLink
            to="/speakers"
            class="absolute bottom-0 left-1/2 z-30 w-fit -translate-x-1/2 whitespace-nowrap rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary transition-colors hover:bg-vconf-primary hover:text-white md:px-12 md:py-3 md:text-[21px]"
          >
            All Speakers
          </NuxtLink>
        </div>
        <NuxtImg
          src="/home/speakers-bg-right.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="220"
          height="842"
          class="pointer-events-none z-20 ml-[-60px] hidden shrink-0 xl:block"
        />

        <NuxtImg
          src="/home/speakers-bg-right-md.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="191"
          height="842"
          class="pointer-events-none z-20 ml-[-80px] hidden shrink-0 md:block xl:hidden"
        />

        <NuxtImg
          src="/home/speakers-bg-right-sm.png"
          placeholder
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="93"
          height="421"
          class="pointer-events-none z-20 ml-[-24px] block shrink-0 md:hidden"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 與講者照 SVG 遮罩同一個平行四邊形（267×374 的 M4 28.8947L263 0V366L4 313.026Z），
   讓神秘卡的外形跟其他卡片一致 */
.speaker-card-frame {
  clip-path: polygon(1.5% 7.73%, 98.5% 0%, 98.5% 97.86%, 1.5% 83.7%);
}
</style>
