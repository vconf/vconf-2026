<script lang="ts" setup>
import { siteImage } from '~/config/seo.config'

useSeoMeta({
  ogImage: siteImage.url,
  ogImageAlt: siteImage.alt,
  ogImageWidth: siteImage.width,
  ogImageHeight: siteImage.height,
  twitterImage: siteImage.url,
  twitterImageAlt: siteImage.alt,
})

const isProduction = import.meta.env.PROD
const {
  public: { umamiScriptUrl, umamiWebsiteId },
} = useRuntimeConfig()

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

<style>
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
  transition:
    opacity 0.4s,
    filter 0.4s;
}
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}

.layout-enter-active {
  transition: opacity 0.35s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
