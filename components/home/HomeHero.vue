<script setup lang="ts">
const colorMode = useColorMode()
const isDark = ref(false)

const heroBrand = {
  desktop: {
    lightSrc: '/about/hero-logo-md.svg',
    darkSrc: '/about/hero-logo-dark-md.svg',
    width: 455,
    height: 230,
    class: 'hidden pt-[50px] md:block',
  },
  mobile: {
    src: '/about/hero-logo-sm.svg',
    width: 264,
    height: 133,
    class: 'block pt-[50px] md:hidden',
  },
} as const

onMounted(() => {
  isDark.value = colorMode.value === 'dark'
})

watch(
  () => colorMode.value,
  (mode) => {
    isDark.value = mode === 'dark'
  },
)
</script>

<template>
  <section class="relative isolate flex flex-col items-center">
    <!-- 首頁主要 logo（正常文件流，在上） -->
    <NuxtImg
      class="relative z-10"
      :class="heroBrand.desktop.class"
      :width="heroBrand.desktop.width"
      :height="heroBrand.desktop.height"
      :src="isDark ? heroBrand.desktop.darkSrc : heroBrand.desktop.lightSrc"
      loading="eager"
      placeholder
    />
    <NuxtImg
      class="relative z-10"
      :class="heroBrand.mobile.class"
      :width="heroBrand.mobile.width"
      :height="heroBrand.mobile.height"
      :src="heroBrand.mobile.src"
      loading="eager"
      placeholder
    />

    <!-- 場景（正常文件流，在下）。SVG 內 overflow:visible，左扇底部 tile 超出 viewBox -->
    <!-- 底部，會自然溢出到下方 section，形成破格式效果 -->
    <HomeHeroThreeScene class="pointer-events-none w-full translate-y-[-15%]" />

    <!-- 切換按鈕 -->
    <Teleport to="body">
      <ShareThemeToggle class="left-[17px] top-[166px]" />
    </Teleport>
  </section>
</template>
