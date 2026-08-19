import type { AdImage } from '~/types/ad'

/** 與 <picture> 的 media 條件、Tailwind 的 md 斷點保持一致 */
export const AD_DESKTOP_MEDIA = '(min-width: 768px)'

/**
 * 曝光認定：版位一律隨彈窗開啟就在畫面上，所以不看進場比例，
 * 只要分頁在前景且停留滿這個秒數就算一次 impression。
 */
export const AD_IMPRESSION_DWELL = 500

export interface AdFallbackCreative {
  /**
   * 圖片 alt。底圖只是讀取狀態、不是廣告，所以預設留空當裝飾圖；
   * 素材本身有文字訊息時再填，讀螢幕的人才知道上面寫了什麼。
   */
  alt: string
  images: {
    desktop: AdImage
    mobile: AdImage
  }
}

/**
 * 廣告還沒抽到時先顯示的底圖。不可點、不送任何追蹤事件。
 *
 * null 就維持原本的灰色佔位塊；素材備好後照下面的形狀填進來即可，
 * 版位與模糊墊底的呈現都不用再改：
 *
 * export const adFallback: AdFallbackCreative | null = {
 *   alt: '',
 *   images: {
 *     desktop: { url: '/ad/house-desktop.png', width: 300, height: 710 },
 *     mobile: { url: '/ad/house-mobile.png', width: 354, height: 110 },
 *   },
 * }
 */
export const adFallback: AdFallbackCreative | null = null
