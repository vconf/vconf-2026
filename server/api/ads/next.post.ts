import type { AdDraw } from '~/types/ad'

/** Worker 的回應比前端需要的多一個 bag（內含 visitorId），不轉發出去 */
interface WorkerAdResponse extends AdDraw {
  bag: string
}

const VISITOR_COOKIE = 'ad-visitor-id'
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/**
 * 抽出下一則輪播廣告。
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.shuffleWorkerUrl || !config.shuffleApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ad service is not configured',
    })
  }

  // 每位訪客一個匿名 ID，對應 Worker 上獨立的 bag，才不會連續看到重複廣告
  let visitorId = getCookie(event, VISITOR_COOKIE)

  if (!visitorId) {
    visitorId = crypto.randomUUID()

    setCookie(event, VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'lax',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    })
  }

  setResponseHeader(event, 'cache-control', 'no-store')

  try {
    const result = await $fetch<WorkerAdResponse>('/api/ads/next', {
      baseURL: config.shuffleWorkerUrl,
      query: {
        bag: `homepage:${visitorId}`,
      },
      headers: {
        authorization: `Bearer ${config.shuffleApiToken}`,
      },
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
