<script setup lang="ts">
import { eventImage, eventOrganizer, websiteBasic } from '~/config/seo.config'

useSchemaOrg([eventOrganizer, eventImage, websiteBasic])
</script>

<template>
  <div>
    <ShareNavBar />
    <slot></slot>
    <LazyShareFooter hydrate-on-visible />
  </div>
</template>
