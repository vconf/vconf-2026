/**
 * 花絮照片清單與畫面需要的純推導函式（這裡不放任何 Nuxt composable）。
 *
 * 照片檔放 public/recap/，每張都要填原圖的 width／height（燈箱靠它顯示完整照片）
 * 與 ratio（照片牆格子的比例，量自設計稿），兩者缺一都會跳版。
 *
 * id 就是網址（/recap/[id]），同時進 prerender 與 sitemap，
 * 上線後改 id 等於換網址，不要再動；新增照片往陣列後面接，順序即畫面順序。
 */

export interface RecapPhoto {
  /** 網址片段（/recap/[id]）；只用小寫英數與 - */
  id: string
  /** public/ 底下的路徑 */
  src: string
  /** 原圖尺寸；燈箱用它等比縮放，顯示的是完整照片 */
  width: number
  height: number
  /** 照片牆格子的比例（寬 / 高），量自設計稿；照片用 object-cover 裁進格子 */
  ratio: number
  /** 照片說明，同時當 alt 與燈箱的無障礙標題 */
  alt: string
}

/** Load more 指向站外的完整相簿；照片牆本身不分頁，照片一次全出 */
export const RECAP_MORE_URL = 'https://v-conf-gallery.f110118103.workers.dev/'

/**
 * sitemap 的 lastmod 由人工維護：檔案 mtime 在 CI 上是 clone 時間，不能代表內容更新日。
 * 換過照片就改這個日期。
 */
export const recapLastmod = '2026-09-15'

export const recapPhotos: RecapPhoto[] = [
  { id: 'apr-group-photo', src: '/recap/apr-group-photo.jpg', width: 3200, height: 1799, ratio: 4 / 3, alt: '四月小聚結束前的大合照' },
  { id: 'apr-checkin-desk', src: '/recap/apr-checkin-desk.jpg', width: 2399, height: 3200, ratio: 3 / 4, alt: '四月小聚報到桌前的工作人員' },
  { id: 'aug-snack-table', src: '/recap/aug-snack-table.jpg', width: 3200, height: 2133, ratio: 1, alt: '八月小聚準備給與會者的點心與飲料' },
  { id: 'apr-live-recording', src: '/recap/apr-live-recording.jpg', width: 2400, height: 3200, ratio: 1200 / 1614, alt: '側錄相機對著四月小聚的講台' },
  { id: 'jun-audience-crowd', src: '/recap/jun-audience-crowd.jpg', width: 2048, height: 1365, ratio: 4 / 3, alt: '六月小聚坐滿聽眾的現場' },
  { id: 'aug-audience-applause', src: '/recap/aug-audience-applause.jpg', width: 3200, height: 2132, ratio: 1200 / 1170, alt: '八月小聚聽眾為講者鼓掌' },
  { id: 'apr-venue-wide', src: '/recap/apr-venue-wide.jpg', width: 3200, height: 1800, ratio: 4 / 3, alt: '四月小聚開場前的場地全景' },
  { id: 'jun-audience-question', src: '/recap/jun-audience-question.jpg', width: 2048, height: 1365, ratio: 1200 / 1453, alt: '六月小聚與會者拿著麥克風提問' },
  { id: 'aug-laptop-notes', src: '/recap/aug-laptop-notes.jpg', width: 3200, height: 2133, ratio: 1, alt: '與會者一邊聽講一邊在筆電上做筆記' },
  { id: 'aug-venue-overview', src: '/recap/aug-venue-overview.jpg', width: 3200, height: 2133, ratio: 1200 / 932, alt: '八月小聚開場前坐滿人的會場' },
  { id: 'jun-group-photo', src: '/recap/jun-group-photo.jpg', width: 3200, height: 2133, ratio: 4 / 3, alt: '六月小聚的大合照' },
  { id: 'apr-audience-room', src: '/recap/apr-audience-room.jpg', width: 2400, height: 3200, ratio: 3 / 4, alt: '四月小聚現場的聽眾與講台' },
  { id: 'aug-snack-corner', src: '/recap/aug-snack-corner.jpg', width: 3200, height: 2133, ratio: 1, alt: '八月小聚的點心區與交流中的與會者' },
  { id: 'aug-speaker-briefing', src: '/recap/aug-speaker-briefing.jpg', width: 3200, height: 2133, ratio: 1200 / 1614, alt: '講者與工作人員在講台前對流程' },
  { id: 'apr-speaker-slides', src: '/recap/apr-speaker-slides.jpg', width: 3200, height: 2399, ratio: 4 / 3, alt: '四月小聚講者比著投影幕分享' },
  { id: 'jun-qa-panel', src: '/recap/jun-qa-panel.jpg', width: 2048, height: 1365, ratio: 1200 / 1170, alt: '六月小聚的問答時間' },
  { id: 'aug-checkin-snacks', src: '/recap/aug-checkin-snacks.jpg', width: 3200, height: 2133, ratio: 4 / 3, alt: '與會者在報到區領取點心' },
  { id: 'aug-hallway-chat', src: '/recap/aug-hallway-chat.jpg', width: 3200, height: 2133, ratio: 1200 / 1453, alt: '中場休息時間在會場旁聊天的與會者' },
  { id: 'jun-speaker-stage', src: '/recap/jun-speaker-stage.jpg', width: 2048, height: 1365, ratio: 1, alt: '六月小聚講者在大螢幕前分享' },
  { id: 'aug-speaker-pointing', src: '/recap/aug-speaker-pointing.jpg', width: 3200, height: 2133, ratio: 1200 / 932, alt: '講者指著投影幕說明架構' },
  { id: 'apr-speaker-mic', src: '/recap/apr-speaker-mic.jpg', width: 3200, height: 2400, ratio: 4 / 3, alt: '四月小聚講者拿著麥克風分享' },
  { id: 'aug-speaker-mic', src: '/recap/aug-speaker-mic.jpg', width: 3200, height: 2132, ratio: 3 / 4, alt: '八月小聚講者回答線上提問' },
  { id: 'aug-attendees-wave', src: '/recap/aug-attendees-wave.jpg', width: 3200, height: 2133, ratio: 1, alt: '與會者在座位上向鏡頭打招呼' },
  { id: 'jun-qa-standing', src: '/recap/jun-qa-standing.jpg', width: 2048, height: 1365, ratio: 1200 / 1614, alt: '六月小聚結束後講者與與會者交流' },
  { id: 'aug-speaker-opening', src: '/recap/aug-speaker-opening.jpg', width: 3200, height: 2134, ratio: 4 / 3, alt: '八月小聚第一場議程開講' },
  { id: 'aug-attendees-side', src: '/recap/aug-attendees-side.jpg', width: 3200, height: 2132, ratio: 1200 / 1170, alt: '從側邊看過去的八月小聚聽眾席' },
  { id: 'jun-speaker-podium', src: '/recap/jun-speaker-podium.jpg', width: 2048, height: 1365, ratio: 4 / 3, alt: '六月小聚講者講解程式範例' },
  { id: 'aug-neon-corner', src: '/recap/aug-neon-corner.jpg', width: 3200, height: 2133, ratio: 1200 / 1453, alt: '會場霓虹燈牆邊的與會者' },
  { id: 'apr-speaker-lightshirt', src: '/recap/apr-speaker-lightshirt.jpg', width: 3200, height: 2399, ratio: 1, alt: '四月小聚另一位講者分享中' },
  { id: 'aug-venue-setup', src: '/recap/aug-venue-setup.jpg', width: 3200, height: 2133, ratio: 1200 / 932, alt: '八月小聚開場前準備就緒的會場' },
]

/**
 * 依高度分欄：每張都放進目前最矮的那一欄（multicol 只求塞得下，收尾會差一大截）。
 * 欄寬相等，相對高度用 1 / ratio 就夠，不必知道實際像素寬。
 */
export function distributeRecapPhotos(
  photos: RecapPhoto[],
  columnCount: number,
): RecapPhoto[][] {
  const columns: RecapPhoto[][] = Array.from({ length: columnCount }, () => [])
  const heights = Array.from({ length: columnCount }, () => 0)

  for (const photo of photos) {
    let shortest = 0

    for (let index = 1; index < columnCount; index++) {
      if (heights[index]! < heights[shortest]!)
        shortest = index
    }

    columns[shortest]!.push(photo)
    heights[shortest]! += 1 / photo.ratio
  }

  return columns
}

export function findRecapPhoto(id: string | undefined) {
  return id ? (recapPhotos.find(photo => photo.id === id) ?? null) : null
}

/** 燈箱左右切換用；找不到回 -1，呼叫端自行判斷 */
export function recapPhotoIndex(photo: RecapPhoto | null) {
  return photo ? recapPhotos.indexOf(photo) : -1
}

/** 左右循環，走到頭接回另一端，方向鍵不會有「按不動」的死角 */
export function adjacentRecapPhoto(photo: RecapPhoto | null, step: 1 | -1) {
  const index = recapPhotoIndex(photo)

  if (index < 0 || recapPhotos.length === 0)
    return null

  const next = (index + step + recapPhotos.length) % recapPhotos.length

  return recapPhotos[next] ?? null
}

/**
 * 花絮還沒公開：/recap 是 coming-soon，正式版掛在 /recap/unpublish（noindex、不進 sitemap）。
 * 上線時把 pages/recap/unpublish/[[photo]].vue 搬成 pages/recap/[[photo]].vue、
 * 刪掉 pages/recap/index.vue，這裡改回 '/recap'。
 */
export const RECAP_BASE_PATH = '/recap/unpublish'

/** 燈箱路由（/recap/[id]），prerender 與 sitemap 共用 */
export const recapPhotoRoutes: string[] = recapPhotos.map(
  photo => `/recap/${photo.id}`,
)

/**
 * 上線後併進 config/seo.config.ts 的 sitemap.urls（在 nuxt.config 組合）。
 * 還沒公開，所以 nuxt.config 目前沒有用它。
 */
export const recapSitemapUrls = [
  { loc: '/recap', priority: 0.7, lastmod: recapLastmod },
  ...recapPhotoRoutes.map(loc => ({
    loc,
    priority: 0.5,
    lastmod: recapLastmod,
  })),
]
