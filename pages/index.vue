<script setup lang="ts">
import { earlyBirdCta } from '~/config/cta.config'
import { eventBasic, eventLocation } from '~/config/seo.config'

useSchemaOrg([eventLocation, eventBasic])

useSeoMeta({
  title: 'v-conf Taiwan 2026｜Vue.js',
  titleTemplate: '%s',
  description:
    'v-conf Taiwan 2026 將於 10 月 17 日在台北政大公企中心舉行，由 Vue.js Taiwan 主辦。早鳥票 NT$1,600 開賣中，六場議程涵蓋 Vue、Vite 與現代前端工具鏈。',
})
</script>

<template>
  <main>
    <HomeHero />
    <LazyHomeCountdown hydrate-on-visible />
    <HomeSpeakers />
    <LazyHomeSponsorSection hydrate-on-visible />
    <ShareFloatingCta
      :text="earlyBirdCta.text"
      :href="earlyBirdCta.url"
    />
  </main>
</template>
