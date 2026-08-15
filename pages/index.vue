<script setup lang="ts">
import { eventBasic, eventLocation, site } from '~/config/seo.config'

const ctaInfo = {
  text: '早鳥優惠',
  url: 'https://www.accupass.com/event/2608061222041992146998',
} as const

useSchemaOrg([eventLocation, eventBasic])

useSeoMeta({
  title: 'v-conf Taiwan 2026｜Vue.js',
  titleTemplate: '%s',
  description: site.description,
})
</script>

<template>
  <main>
    <HomeHero />
    <LazyHomeCountdown hydrate-on-visible />
    <!-- <HomeSpeakers /> -->
    <LazyHomeSponsorSection hydrate-on-visible />
    <ShareFloatingCta
      :text="ctaInfo.text"
      :href="ctaInfo.url"
    />
  </main>
</template>
