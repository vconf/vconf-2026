interface AdTrackingPayload {
  sponsor: string
}

function trackAdEvent(eventName: string, payload: AdTrackingPayload) {
  if (!import.meta.env.PROD || !import.meta.client)
    return

  window.umami?.track(eventName, payload)
}

export function trackAdImpression(sponsorName: string) {
  trackAdEvent('ad-impression', { sponsor: sponsorName })
}

export function trackAdClick(sponsorName: string) {
  trackAdEvent('ad-click', { sponsor: sponsorName })
}
