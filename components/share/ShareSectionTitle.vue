<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  marginBottom?: 24 | 32 | 56 | 249
  breakpoint?: 'xs' | 'md'
}>(), {
  marginBottom: 32,
  breakpoint: 'xs',
})

const marginBottomClass = computed(() => {
  if (props.marginBottom === 24)
    return 'mb-6'

  if (props.marginBottom === 249)
    return 'mb-[249px]'

  const map = {
    56: { xs: 'xs:mb-14 mb-4', md: 'md:mb-14 mb-4' },
    32: { xs: 'xs:mb-8 mb-4', md: 'md:mb-8 mb-4' },
  } as const

  return map[props.marginBottom as 32 | 56][props.breakpoint]
})
</script>

<template>
  <h2
    class="flex items-center justify-center whitespace-nowrap text-center font-serif text-[clamp(32px,calc(11.111vw-21.333px),64px)] font-bold leading-[1.2] tracking-[0.01em] text-vconf-heading xs:tracking-[0em]"
    :class="marginBottomClass"
  >
    <span class="translate-y-[2px] pr-2 text-[clamp(16px,calc(5.556vw-10.667px),32px)] lg:pr-6">(</span>
    <span class="pr-2 lg:pr-6">{{ title }}</span>
    <span class="translate-y-[2px] text-[clamp(16px,calc(5.556vw-10.667px),32px)]">)</span>
  </h2>
</template>
