<script setup lang="ts">
definePageMeta({
  layout: false,
})

useSeoMeta({
  title: '議程即將公開',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div
    class="relative m-auto grid min-h-svh place-content-center overflow-hidden"
  >
    <div class="z-10 flex flex-col items-center px-4">
      <!-- 背景圖 -->
      <NuxtImg
        src="/coming-soon/decorate-bg-left-large.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        width="1258"
        height="1150"
        class="pointer-events-none absolute left-[clamp(-990px,calc(53.32vw_-_1399.4px),-717px)] top-[-434px] hidden max-w-none md:block"
      />
      <NuxtImg
        src="/coming-soon/decorate-bg-right-large.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        width="1224"
        height="1293"
        class="pointer-events-none absolute right-[clamp(-942px,calc(57.03vw_-_1380.9px),-650px)] top-[-655px] hidden max-w-none md:block"
      />
      <NuxtImg
        src="/coming-soon/decorate-bg-left-small.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        width="810"
        height="817"
        class="pointer-events-none absolute bottom-[-494px] left-[-422px] block max-w-none md:hidden"
      />
      <NuxtImg
        src="/coming-soon/decorate-bg-right-small.png"
        alt=""
        aria-hidden="true"
        loading="eager"
        width="807"
        height="818"
        class="pointer-events-none absolute right-[-435px] top-[-510px] block max-w-none md:hidden"
      />
      <!-- logo -->
      <NuxtImg
        width="362"
        height="182"
        alt="v-conf Taiwan 2026"
        loading="eager"
        src="/coming-soon/logo-large.svg"
        class="mb-4 hidden md:block"
      />
      <NuxtImg
        width="265"
        height="134"
        alt="v-conf Taiwan 2026"
        loading="eager"
        src="/coming-soon/logo-small.svg"
        class="mb-2 block md:hidden"
      />
      <!-- 建置圖片 -->
      <NuxtImg
        width="772"
        height="133"
        alt=""
        aria-hidden="true"
        loading="eager"
        src="/coming-soon/bg-large.png"
        class="mb-4 hidden p-4 md:block"
      />
      <NuxtImg
        width="386"
        height="67"
        alt=""
        aria-hidden="true"
        loading="eager"
        src="/coming-soon/bg-small.png"
        class="mb-2 block p-4 md:hidden"
      />
      <p
        class="mb-2 p-[5px] font-serif text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:mb-4 md:p-[10px] md:text-[24px] md:leading-[1.2] md:tracking-[0em]"
      >
        建置中，敬請期待
      </p>
      <NuxtLink
        to="/"
        class="rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:px-12 md:py-3 md:text-[21px]"
      >
        回首頁
      </NuxtLink>
    </div>
  </div>
</template>
