interface AdTrackingPayload {
  sponsor: string
}

export function useAdTracking() {
  const trackEvent = (eventName: string, payload: AdTrackingPayload) => {
    if (!import.meta.env.PROD || !import.meta.client)
      return

    window.umami?.track(eventName, payload)
  }

  const createSponsorTracker = (eventName: string) => {
    return (sponsorName: string) => {
      trackEvent(eventName, { sponsor: sponsorName })
    }
  }

  return {
    trackImpression: createSponsorTracker('ad-impression'),
    trackClick: createSponsorTracker('ad-click'),
  }
}
