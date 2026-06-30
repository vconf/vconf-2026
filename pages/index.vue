<script setup lang="ts">
import { eventBasic, eventLocation, site } from '~/config/seo.config'

useSchemaOrg([
  eventLocation,
  {
    ...eventBasic,
  },
])

useSeoMeta({
  title: '首頁',
  description: site.description,
})
</script>

<template>
  <main>
    <HomeHero />
    <HomeCountdown />
    <!-- <HomeSpeakers /> -->
    <!-- <HomeSponsorSection /> -->
  </main>
</template>
