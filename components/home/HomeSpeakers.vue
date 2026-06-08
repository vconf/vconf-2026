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
    768: {
      slidesPerView: 4,
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
  <section class="relative isolate overflow-visible px-6 pb-[180px] pt-[99px]">
    <div class="container relative z-10">
      <!-- 標題 -->
      <ShareSectionTitle
        title="Speakers"
        :margin-bottom="56"
      />

      <!-- 輪播卡片 -->
      <ClientOnly>
        <div class="relative mx-auto max-w-[1004px] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-6 before:bg-gradient-to-r before:from-vconf-white before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-6 after:bg-gradient-to-l after:from-vconf-white after:to-transparent after:content-['']">
          <swiper-container
            ref="swiperRef"
            :init="false"
            data-swiper="speakers"
            class="mx-auto block max-w-[1004px]"
          >
            <swiper-slide
              v-for="(speaker, index) in DISPLAY_SPEAKERS"
              :key="`${speaker.name}-${index}`"
              class="flex justify-center"
            >
              <div class="w-[267px] min-w-[267px] shrink-0">
                <svg
                  data-speaker-image-frame
                  viewBox="0 0 267 374"
                  xmlns="http://www.w3.org/2000/svg"
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
                <div class="px-[45px] pt-4 text-center">
                  <h3
                    data-speaker-name
                    class="mb-[14px] font-serif text-[24px] font-bold leading-[1.2] tracking-[0%] text-vconf-primary"
                  >
                    {{ speaker.name }}
                  </h3>
                  <p
                    data-speaker-topic
                    class="mb-4 font-serif text-[16px] leading-[1.6] tracking-[0%] text-vconf-text-read"
                  >
                    {{ speaker.topic }}
                  </p>

                  <NuxtLink
                    to="#"
                    class="relative isolate inline-flex items-center justify-center bg-vconf-white px-8 py-[6px] font-avenir text-vconf-primary before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-vconf-primary before:content-['']"
                  >
                    More
                  </NuxtLink>
                </div>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
      </ClientOnly>

      <!-- 左右背景圖片 -->
      <NuxtImg
        src="/home/speakers-bg-left.png"
        width="220"
        height="842"
        class="pointer-events-none absolute left-[5.5%] top-1/2 z-10 hidden -translate-y-1/2 md:block"
      />

      <NuxtImg
        src="/home/speakers-bg-right.png"
        width="220"
        height="842"
        class="pointer-events-none absolute right-[5.5%] top-1/2 z-10 hidden -translate-y-1/2 md:block"
      />
    </div>
  </section>
</template>

<style scoped>
[data-speaker-image-frame] {
  display: block;
  height: 374px;
  width: 267px;
}
</style>
