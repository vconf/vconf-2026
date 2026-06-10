<script setup lang="ts">
const SPEAKERS = [
  { name: '尤雨溪', topic: 'Creator of Vue.js', image: 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Hunter', topic: 'Creator of Vue.js', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'SerKo', topic: 'Creator of Vue.js', image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'KuKu', topic: 'Creator of Vue.js', image: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
] as const

const DISPLAY_SPEAKERS = [...SPEAKERS, ...SPEAKERS]

const swiperRef = ref(null)

useSwiper(swiperRef, {
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
})
</script>

<template>
  <section class="relative isolate overflow-visible pt-[99px]">
    <div class="container relative z-10">
      <!-- 標題 -->
      <ShareSectionTitle
        title="Speakers"
        :margin-bottom="-85"
      />

      <!-- 主要內容 -->
      <div class="mx-auto flex min-h-[421px] items-center justify-center overflow-visible md:h-[842px] md:min-h-0 xl:max-w-[1397px]">
        <NuxtImg
          src="/home/speakers-bg-left.png"
          width="220"
          height="842"
          class="pointer-events-none z-20 mr-[-60px] hidden shrink-0 xl:block"
        />

        <NuxtImg
          src="/home/speakers-bg-left-md.png"
          width="191"
          height="842"
          class="pointer-events-none z-20 mr-[-80px] hidden shrink-0 md:block xl:hidden"
        />

        <NuxtImg
          src="/home/speakers-bg-left-sm.png"
          width="93"
          height="421"
          class="pointer-events-none z-20 mr-[-24px] block shrink-0 md:hidden"
        />

        <div class="relative z-10 min-w-0 flex-1 translate-y-[80px] pb-[78px] md:translate-y-0 md:pb-[124px]">
          <!-- 輪播卡片 -->
          <ClientOnly>
            <div class="relative flex min-w-0 items-center before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-gradient-to-r before:from-vconf-white before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-gradient-to-l after:from-vconf-white after:to-transparent after:content-[''] md:h-full">
              <swiper-container
                ref="swiperRef"
                :init="false"
                data-swiper="speakers"
                class="mx-auto grid place-content-center md:h-full"
              >
                <swiper-slide
                  v-for="(speaker, index) in DISPLAY_SPEAKERS"
                  :key="`${speaker.name}-${index}`"
                  class="speaker-slide flex justify-center md:h-full"
                >
                  <div class="flex w-full max-w-[228px] flex-col md:max-w-none">
                    <svg
                      data-speaker-image-frame
                      viewBox="0 0 267 374"
                      xmlns="http://www.w3.org/2000/svg"
                      class="aspect-speaker-card w-full min-w-0"
                      :aria-label="speaker.name"
                      role="img"
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
                        :href="speaker.image"
                        x="0"
                        y="0"
                        width="267"
                        height="374"
                        preserveAspectRatio="xMidYMid slice"
                        :clip-path="`url(#speaker-mask-${index})`"
                      />
                    </svg>
                    <div class="flex-1 px-6 pt-4 text-center md:px-[45px]">
                      <h3
                        class="mb-[14px] flex items-center justify-center font-serif text-[20px] font-bold leading-[1.2] tracking-[0%] md:text-[24px]"
                      >
                        <span class="pr-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light">{</span>
                        <span class="text-vconf-primary">{{ speaker.name }}</span>
                        <span class="pl-2 font-sans text-[17px] leading-[1] tracking-[0.02em] text-vconf-gray-light">}</span>
                      </h3>
                      <p
                        class="font-serif text-[16px] leading-[1.6] tracking-[0%] text-vconf-text-read"
                      >
                        {{ speaker.topic }}
                      </p>
                    </div>
                  </div>
                </swiper-slide>
              </swiper-container>
            </div>
          </ClientOnly>

          <!-- 全部講者按鈕 -->
          <NuxtLink
            to="#"
            class="absolute bottom-0 left-1/2 z-30 w-fit -translate-x-1/2 whitespace-nowrap rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:px-12 md:py-3 md:text-[21px]"
          >
            All Spekers
          </NuxtLink>
        </div>
        <NuxtImg
          src="/home/speakers-bg-right.png"
          width="220"
          height="842"
          class="pointer-events-none z-20 ml-[-60px] hidden shrink-0 xl:block"
        />

        <NuxtImg
          src="/home/speakers-bg-right-md.png"
          width="191"
          height="842"
          class="pointer-events-none z-20 ml-[-80px] hidden shrink-0 md:block xl:hidden"
        />

        <NuxtImg
          src="/home/speakers-bg-right-sm.png"
          width="93"
          height="421"
          class="pointer-events-none z-20 ml-[-24px] block shrink-0 md:hidden"
        />
      </div>
    </div>
  </section>
</template>
