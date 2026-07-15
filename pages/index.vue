<script setup lang="ts">
import { eventBasic, eventLocation, site } from '~/config/seo.config'

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
    <!-- <HomeSponsorSection /> -->
  </main>
</template>
