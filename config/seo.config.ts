import type { ModuleOptions as SitemapModuleOptions } from '@nuxtjs/sitemap'
import type { ModuleOptions as SiteModuleOptions } from 'nuxt-site-config'

export const site = {
  url: 'https://v-conf.vue.tw/',
  name: 'v-conf Taiwan 2026',
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

export const siteImage = {
  url: 'https://v-conf.vue.tw/og-image.png',
  alt: 'v-conf Taiwan 2026',
  width: 1200,
  height: 630,
} as const

export const eventOrganizer = {
  '@id': 'https://v-conf.vue.tw/#organization',
  '@type': 'Organization',
  'name': 'Vue.js Taiwan',
  'url': 'https://v-conf.vue.tw/',
  'email': 'vuejs_taiwan@googlegroups.com',
  'sameAs': [
    'https://www.threads.com/@vuejs_taiwan',
    'https://www.instagram.com/vuejs_taiwan',
  ],
} as const

export const eventLocation = {
  '@id': 'https://v-conf.vue.tw/#location',
  '@type': 'Place',
  'name': '政大公企中心 A2 國際會議廳',
  'hasMap':
    'https://www.google.com/maps/place/106%E8%87%BA%E5%8C%97%E5%B8%82%E5%A4%A7%E5%AE%89%E5%8D%80%E6%B0%B8%E5%BA%B7%E9%87%8C%E9%87%91%E8%8F%AF%E8%A1%97187%E8%99%9F/data=!4m2!3m1!1s0x3442a9836e26dc93:0xa633d1d75abd7053?sa=X&ved=1t:242&ictx=111',
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '金華街187號',
    'addressLocality': '大安區',
    'addressRegion': '臺北市',
    'postalCode': '106',
    'addressCountry': 'TW',
  },
} as const

export const eventImage = {
  '@id': 'https://v-conf.vue.tw/#event-image',
  '@type': 'ImageObject',
  'contentUrl': siteImage.url,
  'inLanguage': 'zh-TW',
  'url': siteImage.url,
} as const

export const websiteBasic = {
  '@id': 'https://v-conf.vue.tw/#website',
  '@type': 'WebSite',
  'name': site.name,
  'description': site.description,
  'inLanguage': site.defaultLocale,
  'url': site.url,
  'image': {
    '@id': 'https://v-conf.vue.tw/#event-image',
  },
  'publisher': {
    '@id': 'https://v-conf.vue.tw/#organization',
  },
} as const

export const eventBasic = {
  '@id': 'https://v-conf.vue.tw/#main-event',
  '@type': 'Event',
  'name': '2026 vconf 技術研討會',
  'description':
    '聚焦 Vue 生態系與現代前端開發體驗,分享 Vue、Vite、工具鏈與實務案例等前端議題,與開發者一同探索 Web 開發的下一個階段',
  'inLanguage': 'zh-TW',
  'image': {
    '@id': 'https://v-conf.vue.tw/#event-image',
  },
  'startDate': '2026-10-17T09:30:00+08:00',
  'endDate': '2026-10-17T16:00:00+08:00',
  'eventStatus': 'https://schema.org/EventScheduled',
  'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
  'url': 'https://v-conf.vue.tw/',
  'location': {
    '@id': 'https://v-conf.vue.tw/#location',
  },
  'organizer': {
    '@id': 'https://v-conf.vue.tw/#organization',
  },
} as const
