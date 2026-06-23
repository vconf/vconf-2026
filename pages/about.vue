<script lang="ts" setup>
import { trackAdImpression } from '@/utils/adTracking'

useSeoMeta({
  title: '關於我們',
  description:
    'v-conf Taiwan 2026 是台灣 Vue.js 開發者的年度聚會，在這裡回顧技術演進、認識同路人，一起想像前端的下一步。',
})

onMounted(() => {
  trackAdImpression('testUse')
})
</script>

<template>
  <main>
    <AboutHero />
    <AboutCommunityDiamond />
    <AboutCodeOfConduct />
  </main>
</template>
