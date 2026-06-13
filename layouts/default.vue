<script setup lang="ts">
onMounted(() => {
  const colorMode = useColorMode()
  colorMode.preference = Math.random() > 0.5 ? 'light' : 'dark'
})
</script>

<template>
  <div>
    <ShareNavBar class="relative z-20" />
    <slot></slot>
    <ShareFooter />
  </div>
</template>
