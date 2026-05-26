<script lang="ts" setup>
const { trackImpression } = useAdTracking()

onMounted(() => {
  trackImpression('testUse')
})
</script>

<template>
  <div>
    <AboutHero />
    <AboutCommunityDiamond />
    <AboutCodeOfConduct />
    <!-- <AboutSponsors /> -->
  </div>
</template>
