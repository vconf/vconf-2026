import type { AdDraw } from '~/types/ad'
import { AD_DESKTOP_MEDIA } from '~/config/ad.config'

type AdSlotStatus = 'idle' | 'loading' | 'ready' | 'failed'

interface CreativeRequest {
  image: HTMLImageElement
  priority: 'high' | 'low'
  promise: Promise<boolean>
}

/**
 * 同一時間只允許一次 reserve；多個入口同時觸發時共用同一個請求。
 * 廣告全程只在瀏覽器端跑，所以放模組層級不會有 SSR 跨請求污染。
 */
let inflight: Promise<AdDraw | null> | null = null
const creativeRequests = new Map<string, CreativeRequest>()

/** 目前斷點實際會顯示的那張素材 */
function creativeUrl(item: AdDraw) {
  return window.matchMedia(AD_DESKTOP_MEDIA).matches
    ? item.ad.images.desktop.url
    : item.ad.images.mobile.url
}

/** 目前斷點對應的低解析預覽；舊版 Worker 沒提供時回傳 undefined */
function previewUrl(item: AdDraw) {
  return window.matchMedia(AD_DESKTOP_MEDIA).matches
    ? item.ad.images.desktop.previewUrl
    : item.ad.images.mobile.previewUrl
}

function loadCreative(url: string, priority: 'high' | 'low') {
  const existing = creativeRequests.get(url)

  if (existing) {
    if (priority === 'high' && existing.priority === 'low') {
      existing.priority = 'high'
      existing.image.setAttribute('fetchpriority', 'high')
    }

    return existing.promise
  }

  const image = new Image()

  const promise = new Promise<boolean>((resolve) => {
    image.onload = async () => {
      try {
        await image.decode()
      }
      catch {
        // 圖已載入時仍可顯示；decode() 失敗不應阻斷廣告版位。
      }

      resolve(true)
    }
    image.onerror = () => {
      creativeRequests.delete(url)
      resolve(false)
    }
  })

  // 保留解碼完成的 Image，直到真正的廣告元件使用同一 URL。
  creativeRequests.set(url, { image, priority, promise })
  image.setAttribute('fetchpriority', priority)
  image.src = url

  return promise
}

/**
 * 向 Worker 保留目前這一格，並把素材抓回來解好碼。
 * reserve 不會消耗袋子，所以重複呼叫是安全的，而且拿到的必然是同一則。
 */
function requestReserve(): Promise<AdDraw | null> {
  if (inflight)
    return inflight

  inflight = (async () => {
    try {
      const next = await $fetch<AdDraw>('/api/ads/reserve', { method: 'POST' })
      const preview = previewUrl(next)

      if (preview) {
        // 先讓極小預覽可立即顯示；完整素材繼續在背景下載。
        await loadCreative(preview, 'low')
        void loadCreative(creativeUrl(next), 'high')
      }
      else {
        // 前端與 Worker 滾動部署期間仍相容舊回應。
        await loadCreative(creativeUrl(next), 'high')
      }

      return next
    }
    catch {
      return null
    }
    finally {
      inflight = null
    }
  })()

  return inflight
}

/**
 * 廣告版位的共用狀態。
 *
 * 抽廣告與素材下載都提前到「使用者表現出意圖」的時候（游標移到議程卡、觸控按下、
 * 或直接以講者網址進站），而不是等彈窗掛載才開始。
 *
 * 「保留」與「消耗」是分開的兩步：reserve 只讀取，曝光成立才 commit。
 * 所以沒開彈窗、或開了馬上關掉，都不會吃掉輪播的名額 —— 下一次仍然是同一則。
 * 袋子前進的次數因此等於實際曝光數，Umami 的曝光紀錄可以直接跟輪播進度對帳。
 */
export function useAdSlot() {
  /** 目前保留住、還沒確認曝光的那一格 */
  const head = useState<AdDraw | null>('ad-slot-head', () => null)
  const status = useState<AdSlotStatus>('ad-slot-status', () => 'idle')

  /** 提前把這一格抓回來備好；重複呼叫安全，也不會消耗袋子 */
  async function reserve() {
    if (!import.meta.client || head.value)
      return

    status.value = 'loading'

    const next = await requestReserve()

    // 期間可能已經被另一個呼叫填好，不要覆蓋掉
    if (!head.value)
      head.value = next

    status.value = head.value ? 'ready' : 'failed'
  }

  /**
   * 曝光成立後確認消耗，袋子這時才前進，接著立刻保留下一格，
   * 讓下一次開啟彈窗仍然是即時的。
   */
  async function commit(draw: AdDraw) {
    if (!import.meta.client)
      return

    try {
      await $fetch('/api/ads/commit', {
        method: 'POST',
        body: { cycle: draw.cycle, position: draw.position },
        // 曝光成立後使用者隨即關掉分頁時，讓這筆請求還能送完
        keepalive: true,
      })
    }
    catch {
      // 送不到就維持原狀：下次 reserve 會拿到同一則，重複曝光比漏記安全
    }

    // 成功會換到下一格，失敗則仍是同一格；兩種情況都重新保留並預載素材
    head.value = null
    await reserve()
  }

  return {
    head: computed(() => head.value),
    status: computed(() => status.value),
    reserve,
    commit,
  }
}
