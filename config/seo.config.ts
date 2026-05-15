export const site = {
  url: 'https://vconf-2026.vercel.app/',
  name: '2026 vconf 技術研討會',
  description:
    '聚焦 Vue 生態系與現代前端開發體驗，分享 Vue、Vite、工具鏈與實務案例等前端議題，與開發者一同探索 Web 開發的下一個階段',
  defaultLocale: 'zh-TW',
  ogImage: {
    url: 'https://webconf.tw/og.jpg',
  },
  twitter: '@vuejs_taiwan',
}

// 如果沒有給 og:image 會由標題組成 ogImage，這是文字預設字型
export const ogImage = {
  fonts: ['Noto+Sans+TC:700', 'Mina:700'],
}
