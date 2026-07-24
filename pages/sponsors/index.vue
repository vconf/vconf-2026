<script setup lang="ts">
useSeoMeta({
  title: '贊助夥伴',
  description:
    'v-conf Taiwan 2026 誠摯邀請企業成為贊助夥伴，透過品牌曝光與現場互動連結前端開發者社群，一同支持 Vue.js 生態與開源技術發展',
})
</script>

<template>
  <main>
    <ShareHero title="Sponsors" />
    <LazySponsorsList hydrate-on-visible />
  </main>
</template>
