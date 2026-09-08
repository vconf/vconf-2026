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

/** Load more 每次再放一批的張數；設計稿 Frame 631 容器高 1083，可見的是 3／3／4 張 */
export const RECAP_BATCH_SIZE = 10

/**
 * sitemap 的 lastmod 由人工維護：檔案 mtime 在 CI 上是 clone 時間，不能代表內容更新日。
 * 換過照片就改這個日期。
 */
export const recapLastmod = '2026-09-08'

/**
 * TODO(花絮)：以下 20 筆是從 picsum.photos 抓下來的預覽圖（public/recap/preview-*.jpg），
 * 只為了確認版面與燈箱效果，正式照片進來時整批換掉並一併刪檔：
 *   rm public/recap/preview-*.jpg
 *
 * 換上正式照片時的寫法（width／height 填原圖尺寸，ratio 填格子比例）：
 *
 * ```ts
 * { id: 'opening-keynote', src: '/recap/opening-keynote.jpg', width: 2400, height: 1600, ratio: 4 / 3, alt: '開場 keynote 現場' },
 * ```
 */
export const recapPhotos: RecapPhoto[] = [
  { id: 'preview-01', src: '/recap/preview-01.jpg', width: 1200, height: 800, ratio: 4 / 3, alt: '花絮預覽照片 01' },
  { id: 'preview-02', src: '/recap/preview-02.jpg', width: 800, height: 1200, ratio: 3 / 4, alt: '花絮預覽照片 02' },
  { id: 'preview-03', src: '/recap/preview-03.jpg', width: 1200, height: 675, ratio: 1, alt: '花絮預覽照片 03' },
  { id: 'preview-04', src: '/recap/preview-04.jpg', width: 1000, height: 1000, ratio: 1200 / 1614, alt: '花絮預覽照片 04' },
  { id: 'preview-05', src: '/recap/preview-05.jpg', width: 900, height: 1200, ratio: 4 / 3, alt: '花絮預覽照片 05' },
  { id: 'preview-06', src: '/recap/preview-06.jpg', width: 1200, height: 900, ratio: 1200 / 1170, alt: '花絮預覽照片 06' },
  { id: 'preview-07', src: '/recap/preview-07.jpg', width: 1200, height: 800, ratio: 4 / 3, alt: '花絮預覽照片 07' },
  { id: 'preview-08', src: '/recap/preview-08.jpg', width: 800, height: 1000, ratio: 1200 / 1453, alt: '花絮預覽照片 08' },
  { id: 'preview-09', src: '/recap/preview-09.jpg', width: 1200, height: 675, ratio: 1, alt: '花絮預覽照片 09' },
  { id: 'preview-10', src: '/recap/preview-10.jpg', width: 1000, height: 1250, ratio: 1200 / 932, alt: '花絮預覽照片 10' },
  { id: 'preview-11', src: '/recap/preview-11.jpg', width: 1200, height: 800, ratio: 4 / 3, alt: '花絮預覽照片 11' },
  { id: 'preview-12', src: '/recap/preview-12.jpg', width: 900, height: 1200, ratio: 3 / 4, alt: '花絮預覽照片 12' },
  { id: 'preview-13', src: '/recap/preview-13.jpg', width: 1200, height: 900, ratio: 1, alt: '花絮預覽照片 13' },
  { id: 'preview-14', src: '/recap/preview-14.jpg', width: 1100, height: 1100, ratio: 1200 / 1614, alt: '花絮預覽照片 14' },
  { id: 'preview-15', src: '/recap/preview-15.jpg', width: 1200, height: 675, ratio: 4 / 3, alt: '花絮預覽照片 15' },
  { id: 'preview-16', src: '/recap/preview-16.jpg', width: 1200, height: 800, ratio: 1200 / 1170, alt: '花絮預覽照片 16' },
  { id: 'preview-17', src: '/recap/preview-17.jpg', width: 900, height: 1200, ratio: 4 / 3, alt: '花絮預覽照片 17' },
  { id: 'preview-18', src: '/recap/preview-18.jpg', width: 1200, height: 675, ratio: 1200 / 1453, alt: '花絮預覽照片 18' },
  { id: 'preview-19', src: '/recap/preview-19.jpg', width: 1000, height: 1000, ratio: 1, alt: '花絮預覽照片 19' },
  { id: 'preview-20', src: '/recap/preview-20.jpg', width: 800, height: 1200, ratio: 1200 / 932, alt: '花絮預覽照片 20' },
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
