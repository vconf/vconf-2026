/**
 * 輪播廣告的共用型別。
 *
 * 追蹤事件一律使用 SponsorId 這種穩定 ID，不要用 config/sponsors.ts 的顯示名稱
 *（例如 `WISH甜心私覓`、`teacher.place`），顯示名稱會隨行銷需求變動。
 */

/** 廣告贊助商的穩定 ID，對應 config/sponsors.ts 的贊助商 */
export type SponsorId = 'teacher-place' | 'wish'

/** 素材版本；以 768px 為桌機／手機分界 */
export type AdCreative = 'desktop' | 'mobile'

export interface AdImage {
  url: string
  width: number
  height: number
}

export interface Ad {
  id: SponsorId
  title: string
  images: {
    desktop: AdImage
    mobile: AdImage
  }
  targetUrl: string
}

/** Shuffle Bag 抽出的一則廣告；cycle／position／remaining 用來確認輪播進度 */
export interface AdDraw {
  cycle: number
  position: number
  remaining: number
  ad: Ad
}
