import type { AdDraw } from '~/types/ad'

/** Worker 的回應比前端需要的多一個 bag（內含 visitorId），不轉發出去 */
interface WorkerAdResponse extends AdDraw {
  bag: string
}

/**
 * 保留目前這一格廣告，但不消耗它。
 *
 * Worker 端只讀不前進 cursor，所以這支是 idempotent 的：重複呼叫必然拿到同一則。
 * 真正的消耗在 /api/ads/commit，也就是曝光成立的那一刻。
 */
export default defineEventHandler(async (event) => {
  const bag = ensureAdBagName(event)
  const worker = shuffleWorkerRequest(event)

  setResponseHeader(event, 'cache-control', 'no-store')

  try {
    const result = await $fetch<WorkerAdResponse>('/api/ads/reserve', {
      ...worker,
      query: { bag },
    })

    return {
      cycle: result.cycle,
      position: result.position,
      remaining: result.remaining,
      ad: result.ad,
    } satisfies AdDraw
  }
  catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Ad service unavailable',
    })
  }
})
