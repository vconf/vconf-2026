import type { AdCreative, SponsorId } from '~/types/ad'

/**
 * 這一則廣告在洗牌袋裡的位置。
 */
interface AdRotation {
  /** 洗牌袋的第幾輪 */
  cycle: number
  /** 這一輪的第幾格 */
  position: number
}

interface AdTrackingPayload extends AdRotation {
  /** 贊助商穩定 ID，不要送顯示名稱 */
  sponsor: SponsorId
  /** 廣告出現在哪個版位，例如 homepage-sidebar */
  placement: string
  /** 實際顯示的素材版本 */
  creative: AdCreative
}

/**
 * 只在正式環境的瀏覽器端送出，開發與 SSR 階段不污染統計資料。
 * 不要把 visitorId、bag 或任何個資放進 payload。
 */
function trackAdEvent(eventName: string, payload: AdTrackingPayload) {
  if (!import.meta.env.PROD || !import.meta.client)
    return

  // 展開成物件字面值，才對得上 umami.track 參數的 index signature
  window.umami?.track(eventName, { ...payload })
}

export function trackAdImpression(
  sponsor: SponsorId,
  placement: string,
  creative: AdCreative,
  rotation: AdRotation,
) {
  trackAdEvent('sponsor-ad-impression', {
    sponsor,
    placement,
    creative,
    ...rotation,
  })
}

export function trackAdClick(
  sponsor: SponsorId,
  placement: string,
  creative: AdCreative,
  rotation: AdRotation,
) {
  trackAdEvent('sponsor-ad-click', {
    sponsor,
    placement,
    creative,
    ...rotation,
  })
}
