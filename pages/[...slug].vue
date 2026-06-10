<script setup lang="ts">
definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="relative m-auto grid h-svh place-content-center overflow-hidden">
    <div class="flex flex-col items-center md:gap-4">
      <!-- 背景裝飾使用 -->
      <NuxtImg
        src="/coming-soon/decorate-bg-left-large.png"
        width="1258"
        height="1150"
        class="absolute left-[clamp(-990px,calc(53.32vw_-_1399.4px),-717px)] top-[-434px] hidden max-w-none md:block"
      />
      <NuxtImg
        src="/coming-soon/decorate-bg-right-large.png"
        width="1224"
        height="1293"
        class="absolute right-[clamp(-942px,calc(57.03vw_-_1380.9px),-650px)] top-[-655px] hidden max-w-none md:block"
      />
      <!-- 手機版 -->
      <NuxtImg
        src="/coming-soon/decorate-bg-left-small.png"
        width="810"
        height="817"
        class="absolute bottom-[-494px] left-[-422px] block max-w-none md:hidden"
      />
      <NuxtImg
        src="/coming-soon/decorate-bg-right-small.png"
        width="807"
        height="818"
        class="absolute right-[-435px] top-[-510px] block max-w-none md:hidden"
      />
      <!-- logo 區域 -->
      <NuxtImg
        width="362"
        height="182"
        src="/coming-soon/logo-large.svg"
        class="mb-[5px] hidden md:block"
      />
      <NuxtImg
        width="265"
        height="134"
        src="/coming-soon/logo-small.svg"
        class="mb-[8px] block md:hidden"
      />
      <!-- 404 圖片區塊 -->
      <NuxtImg
        width="919"
        height="370"
        src="/404/bg-large.png"
        class="mb-[5px] hidden md:block"
      />
      <NuxtImg
        width="402"
        height="162"
        src="/404/bg-small.png"
        class="mb-[8px] block md:hidden"
      />
      <p class="mb-2 p-[5px] font-serif text-[18px] font-bold leading-[1] tracking-[0.02em] text-vconf-text-read md:mb-4 md:p-[10px] md:text-[24px] md:leading-[1.2] md:tracking-[0em]">
        Sorry, 找不到這個頁面
      </p>
      <!-- All Sponsors 按鈕 -->
      <NuxtLink
        to="/"
        class="rounded-full border border-vconf-primary bg-vconf-white px-8 py-[6px] font-serif text-[16px] font-bold leading-[1.6] tracking-[0.02em] text-vconf-primary md:px-12 md:py-3 md:text-[21px]"
      >
        回首頁
      </NuxtLink>
    </div>
  </div>
</template>
