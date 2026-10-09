<script setup lang="ts">
import { ticketCta } from '~/config/cta.config'

useSeoMeta({
  title: '贊助夥伴',
  description:
    'v-conf Taiwan 2026 誠摯邀請企業成為贊助夥伴，透過品牌曝光與現場互動連結前端開發者社群，一同支持 Vue.js 生態與開源技術發展',
})
</script>

<template>
  <main>
    <ShareHero title="Sponsors" />
    <LazySponsorsList
      class="relative z-40"
      :hydrate-on-visible="{ rootMargin: '200px' }"
    />
    <ShareFloatingCta
      :text="ticketCta.text"
      :href="ticketCta.url"
    />
  </main>
</template>
