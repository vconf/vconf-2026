<script setup lang="ts">
const colorMode = useColorMode()
const isDark = ref(false)

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
  <section class="relative isolate flex w-screen flex-col items-center overflow-x-hidden">
    <NuxtImg
      class="relative z-10 hidden pt-[50px] md:block"
      :width="heroBrand.desktop.width"
      :height="heroBrand.desktop.height"
      :src="isDark ? heroBrand.desktop.darkSrc : heroBrand.desktop.lightSrc"
      loading="eager"
      placeholder
    />
    <NuxtImg
      class="relative z-10 block pt-[50px] md:hidden"
      :width="heroBrand.mobile.width"
      :height="heroBrand.mobile.height"
      :src="heroBrand.mobile.src"
      loading="eager"
      placeholder
    />

    <HomeHeroThreeScene class="pointer-events-none w-full translate-y-[-24%]" />

    <Teleport to="body">
      <ShareThemeToggle class="left-[17px] top-[166px]" />
    </Teleport>
  </section>
</template>
