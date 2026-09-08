<script setup lang="ts">
definePageMeta({
  layout: false,
})

// 正式版在 pages/recap/unpublish/，上線時搬過來取代這支並移除 noindex
useSeoMeta({
  title: '花絮即將公開',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ShareComingSoon />
</template>
