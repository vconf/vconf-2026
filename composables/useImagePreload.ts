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

interface PreloadRequest {
  image: HTMLImageElement
  priority: Priority
  promise: Promise<boolean>
}

/**
 * 跨元件共用同一個請求與解碼結果。
 * 保留 Image 實例，避免瀏覽器在真正掛上 <img> 前就回收剛解碼好的 bitmap。
 */
const requests = new Map<string, PreloadRequest>()

export function useImagePreload() {
  /** 目前裝置實際會用到的斷點與像素密度，只預載這一組 */
  function currentTarget(): { viewport: Viewport, density: Density } {
    return {
      viewport: window.matchMedia(DESKTOP_MEDIA).matches ? 'desktop' : 'mobile',
      density: window.devicePixelRatio > 1 ? 2 : 1,
    }
  }

  function preload(url: string, priority: Priority): Promise<boolean> {
    if (!import.meta.client)
      return Promise.resolve(false)

    const existing = requests.get(url)

    if (existing) {
      // hover / focus 可能發生在背景 low 請求之後；不能因為 URL 已看過就吃掉 high。
      if (priority === 'high' && existing.priority === 'low') {
        existing.priority = 'high'
        existing.image.setAttribute('fetchpriority', 'high')
      }

      return existing.promise
    }

    const image = new Image()
    // fetchpriority 要在 src 之前設定才會影響這次請求
    image.setAttribute('fetchpriority', priority)

    const promise = new Promise<boolean>((resolve) => {
      image.onload = async () => {
        try {
          await image.decode()
        }
        catch {
          // 少數瀏覽器會在已完成載入後拒絕 decode；此時仍可交給畫面顯示。
        }

        resolve(true)
      }
      image.onerror = () => {
        requests.delete(url)
        resolve(false)
      }
    })

    requests.set(url, { image, priority, promise })
    image.src = url

    return promise
  }

  return { currentTarget, preload }
}
