<script lang="ts" setup>
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { siteImage } from '~/config/seo.config'
import { getModalBasePath } from '~/utils/modalRoute'

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
  public: { umamiScriptUrl, umamiWebsiteId, metaPixelId },
} = useRuntimeConfig()

if (isProduction && umamiWebsiteId) {
  useScript({
    'src': umamiScriptUrl,
    'defer': true,
    'data-website-id': umamiWebsiteId,
  })
}

// Meta Pixel 官方貼上碼；SPA 換頁由 fbevents.js 監聽 History API 自動補送 PageView
if (isProduction && metaPixelId) {
  useHead({
    script: [
      {
        key: 'meta-pixel',
        innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
      },
    ],
    noscript: [
      {
        key: 'meta-pixel',
        innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" />`,
      },
    ],
  })
}

useHead({
  script: [{ src: '/vconf-dev-mode.js', defer: true }],
})

// 彈窗路由固定用父路徑當 key，避免開/關彈窗時整頁重新掛載並播放頁面轉場
function pageKey(route: RouteLocationNormalizedLoaded) {
  return getModalBasePath(route.path) ?? route.fullPath
}
</script>

<template>
  <Body class="main-body">
    <NuxtLayout>
      <NuxtPage :page-key="pageKey" />
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
