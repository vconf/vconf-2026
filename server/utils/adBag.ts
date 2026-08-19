import type { H3Event } from 'h3'

/** 匿名訪客 ID；一個 ID 對應 Worker 上一個獨立的洗牌袋 */
const VISITOR_COOKIE = 'ad-visitor-id'
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/** 袋子命名空間；目前整站共用同一輪輪播，不分版位 */
const BAG_NAMESPACE = 'homepage'

function bagName(visitorId: string) {
  return `${BAG_NAMESPACE}:${visitorId}`
}

/** 讀出這位訪客的袋子名稱；沒有 cookie 就回 null，不會發新的 */
export function adBagName(event: H3Event): string | null {
  const visitorId = getCookie(event, VISITOR_COOKIE)

  return visitorId ? bagName(visitorId) : null
}

/** 同 adBagName，但沒有 cookie 時發一個新的匿名 ID */
export function ensureAdBagName(event: H3Event): string {
  const existing = getCookie(event, VISITOR_COOKIE)

  if (existing)
    return bagName(existing)

  const visitorId = crypto.randomUUID()

  setCookie(event, VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: VISITOR_COOKIE_MAX_AGE,
  })

  return bagName(visitorId)
}

/** Worker 的連線設定；缺任一項就是部署設定錯誤，不該被當成廣告服務故障 */
export function shuffleWorkerRequest(event: H3Event) {
  const config = useRuntimeConfig(event)

  if (!config.shuffleWorkerUrl || !config.shuffleApiToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Ad service is not configured',
    })
  }

  return {
    baseURL: config.shuffleWorkerUrl,
    headers: {
      authorization: `Bearer ${config.shuffleApiToken}`,
    },
  }
}

/** cycle 與 position 都是 1 起算的計數 */
export function positiveInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : null
}
