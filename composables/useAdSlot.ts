import type { AdDraw } from '~/types/ad'
import { AD_DESKTOP_MEDIA } from '~/config/ad.config'

type AdSlotStatus = 'idle' | 'loading' | 'ready' | 'failed'

/**
 * 同一時間只允許一次抽廣告；預抽與彈窗開啟同時觸發時共用同一個請求。
 * 廣告全程只在瀏覽器端跑，所以放模組層級不會有 SSR 跨請求污染。
 */
let inflight: Promise<AdDraw | null> | null = null

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
  return new Promise<void>((resolve) => {
    const image = new Image()

    // fetchpriority 要在 src 之前設定才會影響這次請求
    image.setAttribute('fetchpriority', priority)
    image.onload = () => resolve()
    // 失敗也放行，讓 <img> 自己去重試，不要卡住整個版位
    image.onerror = () => resolve()
    image.src = url
  })
}

function requestDraw(): Promise<AdDraw | null> {
  if (inflight)
    return inflight

  inflight = (async () => {
    try {
      const next = await $fetch<AdDraw>('/api/ads/next', { method: 'POST' })
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
 * 目的是讓彈窗打開時廣告已經在手上：抽廣告與素材下載都提前到「使用者表現出意圖」的時候
 * （游標移到議程卡、觸控按下、或直接以講者網址進站），而不是等彈窗掛載才開始。
 */
export function useAdSlot() {
  const draw = useState<AdDraw | null>('ad-slot-draw', () => null)
  const queued = useState<AdDraw | null>('ad-slot-queued', () => null)
  const status = useState<AdSlotStatus>('ad-slot-status', () => 'idle')

  /**
   * 收下抽到的廣告：手上沒有就直接顯示，已經有一則就排隊等下次開啟。
   * prefetch 與 rotate 可能共用同一個請求，回來的是同一個物件時不重複入列。
   */
  function accept(next: AdDraw | null) {
    if (!next)
      return false

    if (draw.value === next || queued.value === next)
      return true

    if (draw.value)
      queued.value = next
    else draw.value = next

    return true
  }

  /** 手上還沒有廣告時去抽一則；重複呼叫是安全的 */
  async function prefetch() {
    if (!import.meta.client)
      return

    if (draw.value || queued.value || inflight)
      return

    status.value = 'loading'
    status.value = accept(await requestDraw()) ? 'ready' : 'failed'
  }

  /** 曝光成立後預抽下一則，讓下一次開啟彈窗是即時的 */
  async function rotate() {
    if (!import.meta.client || queued.value || inflight)
      return

    accept(await requestDraw())
  }

  /** 彈窗重新開啟時換上排隊中的那則；沒有排隊的就繼續顯示同一則 */
  function promote() {
    if (!queued.value)
      return

    draw.value = queued.value
    queued.value = null
    status.value = 'ready'
  }

  return {
    draw: readonly(draw),
    status: readonly(status),
    prefetch,
    rotate,
    promote,
  }
}
