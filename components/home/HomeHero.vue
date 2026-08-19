<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const heroBrand = {
  desktop: {
    lightSrc: '/home/hero-logo-md.svg',
    darkSrc: '/about/hero-logo-dark-md.svg',
    width: 455,
    height: 230,
  },
  mobile: {
    src: '/about/hero-logo-sm.svg',
    width: 264,
    height: 133,
  },
} as const
</script>

<template>
  <section
    class="relative isolate flex w-screen flex-col items-center [overflow-x:clip]"
  >
    <h1>
      <span class="sr-only">v-conf Taiwan 2026 — Vue.js 台灣年度技術研討會</span>
      <picture>
        <source
          media="(min-width: 768px)"
          :srcset="
            isDark ? heroBrand.desktop.darkSrc : heroBrand.desktop.lightSrc
          "
          :width="heroBrand.desktop.width"
          :height="heroBrand.desktop.height"
        />
        <img
          class="relative z-10 block h-auto w-[264px] pt-[50px] md:w-[455px]"
          :src="heroBrand.mobile.src"
          :width="heroBrand.mobile.width"
          :height="heroBrand.mobile.height"
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

    <!-- <Teleport to="body">
      <ShareThemeToggle class="left-[17px] top-[166px]" />
    </Teleport> -->
  </section>
</template>
