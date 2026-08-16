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

/**
 * 以 site.url 組出絕對網址，避免各處硬編網域。
 * 已經是完整網址（http/https）則原樣回傳。
 */
export function absoluteUrl(path: string = '') {
  if (/^https?:\/\//.test(path))
    return path

  return `${site.url.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export const sitemap = {
  excludeAppSources: true,
  zeroRuntime: true,
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
    { loc: '/', priority: 1, lastmod: '2026-07-24' },

    // 主要內容頁面
    { loc: '/about', priority: 0.9, lastmod: '2026-07-24' },
    { loc: '/sponsors', priority: 0.9, lastmod: '2026-07-24' },
    { loc: '/speakers', priority: 0.9, lastmod: '2026-08-16' },

    // 講者介紹（彈窗式路由，talkSlug 對應 content/speakers/*.md，draft 的不列入）
    { loc: '/speakers/kuku', priority: 0.8, lastmod: '2026-08-16' },
    { loc: '/speakers/hunter', priority: 0.8, lastmod: '2026-08-16' },
    { loc: '/speakers/serko', priority: 0.8, lastmod: '2026-08-16' },
    { loc: '/speakers/ray', priority: 0.8, lastmod: '2026-08-16' },
    { loc: '/speakers/kuro', priority: 0.8, lastmod: '2026-08-16' },
  ],
} satisfies Partial<SitemapModuleOptions>

export const siteImage = {
  url: absoluteUrl('og-image.png'),
  alt: 'v-conf Taiwan 2026',
  width: 1200,
  height: 630,
} as const

export const eventOrganizer = {
  '@id': absoluteUrl('#organization'),
  '@type': 'Organization',
  'name': 'Vue.js Taiwan',
  'email': 'vuejs_taiwan@googlegroups.com',
  'sameAs': [
    'https://www.threads.com/@vuejs_taiwan',
    'https://www.instagram.com/vuejs_taiwan',
  ],
} as const

export const eventLocation = {
  '@id': absoluteUrl('#location'),
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
  '@id': absoluteUrl('#event-image'),
  '@type': 'ImageObject',
  'contentUrl': siteImage.url,
  'inLanguage': 'zh-TW',
  'url': siteImage.url,
} as const

export const websiteBasic = {
  '@id': absoluteUrl('#website'),
  '@type': 'WebSite',
  'name': site.name,
  'alternateName': [
    'v-conf Taiwan',
    'v-conf',
    'v-conf.vue.tw',
  ],
  'description': site.description,
  'inLanguage': site.defaultLocale,
  'url': site.url,
  'image': {
    '@id': eventImage['@id'],
  },
  'publisher': {
    '@id': eventOrganizer['@id'],
  },
} as const

export const eventBasic = {
  '@id': absoluteUrl('#main-event'),
  '@type': 'Event',
  'name': 'v-conf Taiwan 2026',
  'description':
    '聚焦 Vue 生態系與現代前端開發體驗,分享 Vue、Vite、工具鏈與實務案例等前端議題,與開發者一同探索 Web 開發的下一個階段',
  'inLanguage': 'zh-TW',
  'image': {
    '@id': eventImage['@id'],
  },
  'startDate': '2026-10-17T09:30:00+08:00',
  'endDate': '2026-10-17T16:00:00+08:00',
  'eventStatus': 'https://schema.org/EventScheduled',
  'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
  'url': site.url,
  'location': {
    '@id': eventLocation['@id'],
  },
  'organizer': {
    '@id': eventOrganizer['@id'],
  },
} as const
