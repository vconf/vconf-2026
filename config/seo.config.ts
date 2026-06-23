import type { ModuleOptions as SitemapModuleOptions } from '@nuxtjs/sitemap'
import type { ModuleOptions as SiteModuleOptions } from 'nuxt-site-config'

export const site = {
  url: 'https://v-conf.vue.tw/',
  name: '2026 vconf 技術研討會',
  description:
    '聚焦 Vue 生態系與現代前端開發體驗，分享 Vue、Vite、工具鏈與實務案例等前端議題，與開發者一同探索 Web 開發的下一個階段',
  defaultLocale: 'zh-TW',
  twitter: '@vuejs_taiwan',
} satisfies Partial<SiteModuleOptions>

export const sitemap = {
  excludeAppSources: true,
  defaults: {
    changefreq: 'weekly',
  },
  xslColumns: [
    { label: 'URL', width: '25%' },
    { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
    { label: 'Change Frequency', select: 'sitemap:changefreq', width: '25%' },
    { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
    { label: 'Hreflangs', select: 'count(xhtml:link)', width: '12.5%' },
  ],
  urls: [
    // 核心頁面
    { loc: '/', priority: 1, lastmod: '2026-06-23' },

    // 主要內容頁面
    { loc: '/about', priority: 0.9, lastmod: '2026-06-23' },
  ],
} satisfies Partial<SitemapModuleOptions>
