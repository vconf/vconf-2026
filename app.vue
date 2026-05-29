<script lang="ts" setup>
useSeoMeta({
  ogImage: 'https://vconf-2026.vercel.app/og-image.png',
  ogImageAlt: 'vconf 2026',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterImage: 'https://webconf.tw/images/seo/og-image.png',
  twitterImageAlt: 'vconf 2026',
})

const isProduction = import.meta.env.PROD
const { public: { umamiScriptUrl, umamiWebsiteId } } = useRuntimeConfig()

if (isProduction && umamiWebsiteId) {
  useScript({
    'src': umamiScriptUrl,
    'defer': true,
    'data-website-id': umamiWebsiteId,
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
