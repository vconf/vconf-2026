<script setup lang="ts">
const colorMode = useColorMode()
const isDark = ref(false)

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
  <div>
    <!-- 首頁主要 logo -->
    <NuxtImg
      class="m-auto hidden pt-[50px] md:block"
      width="455"
      height="230"
      :src="isDark ? '/about/hero-logo-dark-md.svg' : '/about/hero-logo-md.svg'"
      loading="eager"
      placeholder
    />
    <NuxtImg
      class="m-auto block pt-[50px] md:hidden"
      width="264"
      height="133"
      src="/about/hero-logo-sm.svg"
      loading="eager"
      placeholder
    />

    <!-- 切換按鈕 -->
    <Teleport to="body">
      <ShareThemeToggle class="left-[17px] top-[166px]" />
    </Teleport>

    <!-- ThreeScene -->
    <!-- <HomeHeroThreeScene /> -->
  </div>
</template>
