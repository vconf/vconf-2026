<script setup lang="ts">
import { eventBasic, eventLocation, eventOrganizer } from '~/config/seo.config'

useSchemaOrg([
  eventOrganizer,
  eventLocation,
  {
    ...eventBasic,
  },
])
</script>

<template>
  <main>
    <HomeHero />
    <HomeCountdown />
    <!-- <HomeSpeakers /> -->
    <!-- <HomeSponsorSection /> -->
  </main>
</template>
