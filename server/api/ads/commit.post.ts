import type { AdCommitResult } from '~/types/ad'

interface CommitBody {
  cycle?: unknown
  position?: unknown
}

/**
 * 確認這一格廣告真的被看到了，袋子這時才前進。
 *
 * Worker 端用 (cycle, position) 對目前的 cursor 做 compare-and-set，所以多分頁
 * 同時曝光、或同一筆重送，都只會前進一格。
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'cache-control', 'no-store')

  const bag = adBagName(event)

  // 沒有訪客 cookie 就沒有對應的袋子，這筆 commit 沒有目標
  if (!bag)
    return { committed: false } satisfies AdCommitResult

  const body = await readBody<CommitBody>(event).catch(() => null)
  const cycle = positiveInteger(body?.cycle)
  const position = positiveInteger(body?.position)

  if (!cycle || !position) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid draw reference',
    })
  }

  const worker = shuffleWorkerRequest(event)

  try {
    const result = await $fetch<AdCommitResult>('/api/ads/commit', {
      ...worker,
      method: 'POST',
      query: { bag },
      body: { cycle, position },
    })

    return { committed: result.committed === true } satisfies AdCommitResult
  }
  catch {
    return { committed: false } satisfies AdCommitResult
  }
})
