<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  paddingBottom?: 24 | 32
}>(), {
  paddingBottom: 32,
})
</script>

<template>
  <h2
    class="flex items-center justify-center whitespace-nowrap text-center font-serif text-[clamp(28px,5.2vw,64px)] font-bold leading-[1.2] text-vconf-heading xs:text-[64px]"
    :class="[
      paddingBottom === 24 ? 'mb-6' : 'mb-8',
    ]"
  >
    <span class="translate-y-[2px] pr-2 text-[32px] lg:pr-6">(</span>
    <span class="pr-2 lg:pr-6">{{ title }}</span>
    <span class="translate-y-[2px] text-[32px]">)</span>
  </h2>
</template>
