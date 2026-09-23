<script setup lang="ts">
// light / dark 兩組都輸出、用 dark: class 切換；SSR 不知道使用者選的模式，
// 改用 colorMode 決定 srcset 會在 dark 下 hydration mismatch。
const heroBrands = [
  {
    mode: 'light',
    class: 'dark:hidden',
    desktopSrc: '/home/hero-logo-md.svg',
    mobileSrc: '/about/hero-logo-sm.svg',
  },
  {
    mode: 'dark',
    class: 'hidden dark:block',
    desktopSrc: '/about/hero-logo-dark-md.svg',
    mobileSrc: '/about/hero-logo-dark-sm.svg',
  },
] as const

const heroBrandSize = {
  desktop: { width: 455, height: 230 },
  mobile: { width: 264, height: 133 },
} as const
</script>

<template>
  <section
    class="relative isolate flex w-screen flex-col items-center [overflow-x:clip]"
  >
    <h1>
      <span class="sr-only">v-conf Taiwan 2026 — Vue.js 台灣年度技術研討會</span>
      <picture
        v-for="brand in heroBrands"
        :key="brand.mode"
        :class="brand.class"
      >
        <source
          media="(min-width: 768px)"
          :srcset="brand.desktopSrc"
          :width="heroBrandSize.desktop.width"
          :height="heroBrandSize.desktop.height"
        />
        <img
          class="relative z-10 block h-auto w-[264px] pt-[50px] md:w-[455px]"
          :src="brand.mobileSrc"
          :width="heroBrandSize.mobile.width"
          :height="heroBrandSize.mobile.height"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchpriority="high"
        />
      </picture>
    </h1>

    <HomeHeroScene
      class="pointer-events-none mt-[-140px] w-full md:mt-[-266px] min-[1400px]:mt-[calc(-110px_-_11.1531%)]"
    />

    <Teleport to="body">
      <ShareThemeToggle class="left-[17px] top-[166px]" />
    </Teleport>
  </section>
</template>
