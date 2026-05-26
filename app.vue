<script lang="ts">
const isProduction = import.meta.env.PROD
if (isProduction) {
  useScript({
    'src': 'https://cloud.umami.is/script.js',
    'defer': true,
    'data-website-id': '9eb09ba5-2e60-4964-8b65-ab0d6e48fc4a',
  })
}
</script>

<template>
  <Body class="main-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>

<style scoped>
/* 進入時由下往上淡入 */
.page-enter-active {
  transition: transform 0.5s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* 離開時模糊消失 */
.page-leave-active {
  transition: opacity 0.4s, filter 0.4s;
}
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>
