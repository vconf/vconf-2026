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
    <ShareHero
      title="About"
      is-about
    />
    <LazyAboutCommunityDiamond hydrate-on-visible />
    <!-- 軌道 icon 靠 motionPath 定位，提早一點水合避免捲到時 icon 從 0,0 彈上軌道 -->
    <LazyAboutCodeOfConduct :hydrate-on-visible="{ rootMargin: '200px' }" />
  </main>
</template>
