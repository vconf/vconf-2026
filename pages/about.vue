<script lang="ts" setup>
import { trackAdImpression } from '@/utils/adTracking'

onMounted(() => {
  trackAdImpression('testUse')
})
</script>

<template>
  <div>
    <AboutHero />
    <AboutCommunityDiamond />
    <AboutCodeOfConduct />
  </div>
</template>
