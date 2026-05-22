<script setup lang="ts">
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <section class="relative overflow-x-clip text-clip pb-[288px] pt-[166px] text-center">
    <h1 class="h-[106px]">
      <span>About</span>
      <span>VCONF</span>
      <span>TW</span>
    </h1>
    <div class="z-30">
      <NuxtImg
        src="/about/hero-bg-1.png"
        width="1159"
        height="880"
        loading="eager"
        class="pointer-events-none absolute left-[-590px] top-[-87px] z-30 max-w-none"
      />
      <NuxtImg
        src="/about/hero-bg-2.png"
        width="1159"
        height="880"
        loading="eager"
        class="pointer-events-none absolute right-[-559px] top-[-268px] z-30 max-w-none"
      />
    </div>
  </section>
</template>
