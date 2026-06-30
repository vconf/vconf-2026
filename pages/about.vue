<script lang="ts" setup>
import { site } from '~/config/seo.config'

const aboutUrl = `${site.url}about`

useSeoMeta({
  title: '關於我們',
  description:
    'v-conf Taiwan 2026 是台灣 Vue.js 開發者的年度聚會，在這裡回顧技術演進、認識同路人，一起想像前端的下一步。',
})

useSchemaOrg([
  {
    '@id': `${aboutUrl}#breadcrumb`,
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': site.name,
        'item': site.url,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': '關於我們',
        'item': aboutUrl,
      },
    ],
  },
])
</script>

<template>
  <main>
    <AboutHero />
    <AboutCommunityDiamond />
    <AboutCodeOfConduct />
  </main>
</template>
