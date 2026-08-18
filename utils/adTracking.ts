import type { AdCreative, SponsorId } from '~/types/ad'

interface AdTrackingPayload {
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
 *
 * window.umami 的型別由 @nuxt/scripts 的 UmamiAnalyticsApi 全域提供，
 * 這裡不要再自己宣告一次（modifier 不同會觸發 TS2687）。
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
) {
  trackAdEvent('ad-impression', {
    sponsor,
    placement,
    creative,
  })
}

export function trackAdClick(
  sponsor: SponsorId,
  placement: string,
  creative: AdCreative,
) {
  trackAdEvent('ad-click', {
    sponsor,
    placement,
    creative,
  })
}
