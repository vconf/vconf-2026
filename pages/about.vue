<script lang="ts" setup>
import { trackAdImpression } from '@/utils/adTracking'

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
