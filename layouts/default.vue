<script setup lang="ts">
import { eventImage, eventOrganizer, websiteBasic } from '~/config/seo.config'

useSchemaOrg([eventOrganizer, eventImage, websiteBasic])

onMounted(() => {
  const colorMode = useColorMode()
  // colorMode.preference = Math.random() > 0.5 ? 'light' : 'dark'  等 dark 設計稿完成再開啟
  colorMode.preference = 'light'
})
</script>

<template>
  <div>
    <ShareNavBar class="relative z-20" />
    <slot></slot>
    <ShareFooter />
  </div>
</template>
