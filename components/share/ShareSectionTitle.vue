<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  paddingBottom?: 24 | 32 | 56 | 249
}>(), {
  paddingBottom: 32,
})

const marginBottomClass = computed(() => {
  if (props.paddingBottom === 24)
    return 'mb-6'

  if (props.paddingBottom === 56)
    return 'mb-14'

  if (props.paddingBottom === 249)
    return 'mb-[249px]'

  return 'mb-8'
})
</script>

<template>
  <h2
    class="flex items-center justify-center whitespace-nowrap text-center font-serif text-[clamp(28px,5.2vw,64px)] font-bold leading-[1.2] text-vconf-heading xs:text-[64px]"
    :class="marginBottomClass"
  >
    <span class="translate-y-[2px] pr-2 text-[32px] lg:pr-6">(</span>
    <span class="pr-2 lg:pr-6">{{ title }}</span>
    <span class="translate-y-[2px] text-[32px]">)</span>
  </h2>
</template>
