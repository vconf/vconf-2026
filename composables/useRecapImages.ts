import type { Priority, Viewport } from '~/composables/useImagePreload'
import type { RecapPhoto } from '~/config/recap'

/**
 * 花絮燈箱的圖片 URL。
 *
 * 與 useTeamImages 同樣的用意：URL 用 useImage() 產生，跟 <NuxtImg> 走同一條 IPX 路徑，
 * 而 getImage() 在 prerender 時會把 URL 掛上 x-nitro-prerender，讓靜態圖檔在 build 就產出。
 */

/** 燈箱大圖的可用空間，與 RecapPhotoModal 的版面上限一致 */
const MODAL_BOX: Record<Viewport, { width: number, height: number }> = {
  mobile: { width: 402, height: 536 },
  desktop: { width: 1200, height: 650 },
}

/** 縮圖列，尺寸與 RecapPhotoModal 的 <NuxtImg> 一致 */
const THUMB_SIZE: Record<Viewport, { width: number, height: number }> = {
  mobile: { width: 50, height: 50 },
  desktop: { width: 100, height: 100 },
}

const DENSITIES = [1, 2]

/** 一次空閒送幾張；lenis／GSAP 的 rAF 會讓真正的空閒很少，一次一張會拖到幾十秒 */
const WARM_BATCH = 4

/** requestIdleCallback 沒有 VueUse 對應，Safari 16.4 以前也沒有，退回 setTimeout */
function scheduleIdle(task: IdleRequestCallback) {
  return typeof requestIdleCallback === 'function'
    ? requestIdleCallback(task, { timeout: 1000 })
    : (setTimeout(task, 200) as unknown as number)
}

function cancelIdle(handle: number | undefined) {
  if (handle === undefined)
    return

  if (typeof cancelIdleCallback === 'function')
    cancelIdleCallback(handle)
  else clearTimeout(handle)
}

/**
 * 把原圖等比縮進框，回傳實際會顯示的尺寸。稿的 H／V 兩種版型是同一條規則 ——
 * 高度固定、寬度隨比例（桌機 1200×650 對 477×650），所以這組數字也當 IPX 的轉檔尺寸。
 */
export function recapModalSize(photo: RecapPhoto, viewport: Viewport) {
  const box = MODAL_BOX[viewport]
  const scale = Math.min(box.width / photo.width, box.height / photo.height, 1)

  return {
    width: Math.round(photo.width * scale),
    height: Math.round(photo.height * scale),
  }
}

export function recapThumbSize(viewport: Viewport) {
  return THUMB_SIZE[viewport]
}

export function useRecapImages() {
  const img = useImage()
  const { currentTarget, preload } = useImagePreload()

  function toUrl(src: string, width: number, height: number) {
    return img(src, { format: 'avif,webp', width, height })
  }

  /**
   * prerender 時把燈箱會用到的圖註冊進靜態產出。
   *
   * 燈箱是 v-if="visible"、SSR 階段不渲染，裡面的 <NuxtImg> 不會執行，
   * 少了這一步這些圖不會進 build，使用者第一次開燈箱得等 runtime 即時轉檔。
   */
  function registerRecapModalImages(photos: RecapPhoto[]) {
    for (const photo of photos) {
      for (const viewport of ['mobile', 'desktop'] as const) {
        const modal = recapModalSize(photo, viewport)
        const thumb = THUMB_SIZE[viewport]

        for (const density of DENSITIES) {
          toUrl(photo.src, modal.width * density, modal.height * density)
          toUrl(photo.src, thumb.width * density, thumb.height * density)
        }
      }
    }
  }

  /** 只抓目前斷點真正會顯示的那一張大圖，並等到解碼完成。 */
  function preloadRecapPhoto(photo: RecapPhoto, priority: Priority = 'low') {
    const { viewport, density } = currentTarget()
    const { width, height } = recapModalSize(photo, viewport)

    return preload(toUrl(photo.src, width * density, height * density), priority)
  }

  /**
   * 空閒時把整組照片熱起來：先照片牆的圖，再燈箱大圖，兩批都照傳入的順序
   * （呼叫端排成由上而下）。一律用 low 送出，滑到某張時會被升成 high 插隊。
   */
  function warmRecapPhotos(photos: RecapPhoto[]) {
    const connection = (navigator as { connection?: { saveData?: boolean } })
      .connection

    // 使用者開了節省流量就不要自作主張
    if (connection?.saveData)
      return () => {}

    const { viewport, density } = currentTarget()
    const queue = [
      ...photos.map(photo => toUrl(photo.src, photo.width, photo.height)),
      ...photos.map((photo) => {
        const { width, height } = recapModalSize(photo, viewport)

        return toUrl(photo.src, width * density, height * density)
      }),
    ]

    let index = 0
    let handle: number | undefined
    let stopped = false

    function step(deadline?: IdleDeadline) {
      if (stopped)
        return

      for (let sent = 0; sent < WARM_BATCH && index < queue.length; sent++) {
        // 這一格空閒已經用完就先讓出去，didTimeout 代表等不到空閒、不再退讓
        if (deadline && !deadline.didTimeout && deadline.timeRemaining() <= 1)
          break

        void preload(queue[index++]!, 'low')
      }

      if (index < queue.length)
        handle = scheduleIdle(step)
    }

    handle = scheduleIdle(step)

    return () => {
      stopped = true
      cancelIdle(handle)
    }
  }

  return { registerRecapModalImages, preloadRecapPhoto, warmRecapPhotos }
}
