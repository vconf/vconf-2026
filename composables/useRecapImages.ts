import type { Priority, Viewport } from '~/composables/useImagePreload'
import type { RecapPhoto } from '~/config/recap'

/**
 * 花絮燈箱的圖片 URL。
 *
 * 與 useTeamImages 同樣的用意：URL 用 useImage() 產生，跟 <NuxtImg> 走同一條 IPX 路徑，
 * 而 getImage() 在 prerender 時會把 URL 掛上 x-nitro-prerender，讓靜態圖檔在 build 就產出。
 */

/**
 * 燈箱舞台的上限，與 RecapPhotoModal 的 max-h／max-w 一致。
 * 桌機 1600×1066 是版面天花板，不是每台裝置都會用到的尺寸。
 */
const MODAL_BOX: Record<Viewport, { width: number, height: number }> = {
  mobile: { width: 402, height: 536 },
  desktop: { width: 1600, height: 1066 },
}

/** 縮圖列，尺寸與 RecapPhotoModal 的 <NuxtImg> 一致 */
const THUMB_SIZE: Record<Viewport, { width: number, height: number }> = {
  mobile: { width: 50, height: 50 },
  desktop: { width: 100, height: 100 },
}

/** 縮圖列鎖在稿的 H 變體，與 RecapPhotoModal 的 STRIP_RATIO 同一個值 */
const STRIP_RATIO = 3 / 2

/** 舞台外固定吃掉的高度：縮圖列 + gap − 捲軸負 margin（手機 50+32−6，桌機 100+24−10） */
const STAGE_CHROME: Record<Viewport, number> = { mobile: 76, desktop: 114 }

/** 轉檔尺寸的級距，每一階都對應真實裝置：手機 1x/2x、筆電 1x/2x、5K 1x/2x */
const MODAL_WIDTH_STEPS = [480, 960, 1500, 2200, 3200]

/** 縮圖才需要 x2；縮圖尺寸固定，不吃級距 */
const THUMB_DENSITIES = [1, 2]

/** 照片牆每格約 361 CSS 寬，2x 也只要 722，不必拿原生 3200 */
const GRID_MAX_WIDTH = 800

/**
 * 舞台高度是視窗高度的函數，與 RecapPhotoModal 的外層留白一致（桌機 8.3svh、手機 128px）。
 * 只用來挑級距所以容許幾 px 誤差，但 <NuxtImg> 與 preload 必須共用它，否則會下載兩份。
 */
function recapStageHeight(viewport: Viewport, viewportHeight: number) {
  const free = viewport === 'desktop'
    ? viewportHeight * (1 - 0.083 * 2) - STAGE_CHROME.desktop
    : viewportHeight - 128 * 2 - STAGE_CHROME.mobile

  return Math.max(0, Math.min(MODAL_BOX[viewport].height, free))
}

/**
 * 這張照片在這個視窗會顯示多寬（CSS px）。寬度由舞台高度決定，
 * 比 3:2 更寬的照片會被縮圖列的寬度切齊，所以取 min(STRIP_RATIO, 自己的比例)。
 */
function recapPhotoCssWidth(photo: RecapPhoto, viewport: Viewport, viewportHeight: number) {
  const ratio = photo.width / photo.height
  const stage = recapStageHeight(viewport, viewportHeight)

  return Math.min(MODAL_BOX[viewport].width, stage * Math.min(STRIP_RATIO, ratio))
}

/** 級距取「蓋得住需求的最小一階」，並且不超過來源本身，永遠不放大 */
function snapToStep(photo: RecapPhoto, needed: number) {
  const ratio = photo.width / photo.height
  const step = MODAL_WIDTH_STEPS.find(width => width >= needed) ?? MODAL_WIDTH_STEPS.at(-1)!
  const width = Math.min(step, photo.width)

  return { width, height: Math.round(width / ratio) }
}

/**
 * 燈箱大圖的轉檔尺寸。跟著實際顯示寬 × 裝置密度走，再進位到級距 ——
 * 單一固定尺寸會讓筆電多拿一倍、5K 只拿到需求的一半。
 */
export function recapModalRequest(
  photo: RecapPhoto,
  viewport: Viewport,
  viewportHeight: number,
  density: number,
) {
  return snapToStep(photo, recapPhotoCssWidth(photo, viewport, viewportHeight) * density)
}

/** 照片牆的轉檔尺寸；比例與來源相同，裁切一律留給 CSS 的 object-cover */
export function recapGridSize(photo: RecapPhoto) {
  const scale = Math.min(GRID_MAX_WIDTH / photo.width, 1)

  return {
    width: Math.round(photo.width * scale),
    height: Math.round(photo.height * scale),
  }
}

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
      const grid = recapGridSize(photo)

      toUrl(photo.src, grid.width, grid.height)

      for (const viewport of ['mobile', 'desktop'] as const) {
        const thumb = THUMB_SIZE[viewport]

        for (const density of THUMB_DENSITIES)
          toUrl(photo.src, thumb.width * density, thumb.height * density)
      }

      // 級距共 5 階，超過來源的那幾階會收斂成同一個 URL
      for (const step of MODAL_WIDTH_STEPS) {
        const size = snapToStep(photo, step)

        toUrl(photo.src, size.width, size.height)
      }
    }
  }

  /** 只抓目前斷點真正會顯示的那一張大圖，並等到解碼完成。 */
  function preloadRecapPhoto(photo: RecapPhoto, priority: Priority = 'low') {
    const { viewport, density } = currentTarget()
    const { width, height } = recapModalRequest(photo, viewport, window.innerHeight, density)

    return preload(toUrl(photo.src, width, height), priority)
  }

  /**
   * 空閒時把照片牆的圖熱起來，照傳入的順序（呼叫端排成由上而下）。
   * 不熱燈箱大圖：級距最大 3200，30 張會是幾十 MB，鄰近幾張交給 preloadRecapPhoto。
   */
  function warmRecapPhotos(photos: RecapPhoto[]) {
    const connection = (navigator as { connection?: { saveData?: boolean } })
      .connection

    // 使用者開了節省流量就不要自作主張
    if (connection?.saveData)
      return () => {}

    const queue = photos.map((photo) => {
      const { width, height } = recapGridSize(photo)

      return toUrl(photo.src, width, height)
    })

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
