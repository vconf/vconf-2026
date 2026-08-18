/**
 * 圖片預載的共用底層：判斷目前裝置需要哪一組圖，以及實際送出請求。
 *
 * URL 一律由呼叫端用 useImage() 產生，跟 <NuxtImg> 走同一條 IPX 路徑才會命中同一個快取項目。
 */

/** 一張圖的 1x 尺寸；2x 是 width/height 各乘 2，與 <NuxtImg densities="x1 x2"> 的產出一致 */
export interface ImageSpec {
  src: string
  width: number
  height: number
}

export type Viewport = 'mobile' | 'desktop'
export type Density = 1 | 2
export type Priority = 'high' | 'low'

/** 與 Tailwind md 斷點一致 */
const DESKTOP_MEDIA = '(min-width: 768px)'

/** 已送出過的 URL，跨元件共用，避免滑鼠來回進出或多個入口重複請求 */
const requested = new Set<string>()

export function useImagePreload() {
  /** 目前裝置實際會用到的斷點與像素密度，只預載這一組 */
  function currentTarget(): { viewport: Viewport, density: Density } {
    return {
      viewport: window.matchMedia(DESKTOP_MEDIA).matches ? 'desktop' : 'mobile',
      density: window.devicePixelRatio > 1 ? 2 : 1,
    }
  }

  function preload(url: string, priority: Priority) {
    if (!import.meta.client || requested.has(url))
      return

    requested.add(url)

    const image = new Image()
    // fetchpriority 要在 src 之前設定才會影響這次請求
    image.setAttribute('fetchpriority', priority)
    image.src = url
  }

  return { currentTarget, preload }
}
