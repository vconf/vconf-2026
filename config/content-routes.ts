import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 由 content 檔案產生彈窗式路由清單，prerender 與 sitemap 共用，
 * 新增／移除講者或成員時不必再手動維護兩份名單。
 *
 * 只在 build 期間執行（nuxt.config → 這裡），用 node:fs 讀檔；
 * 不要從元件或 composable import，會把 node 內建模組帶進 client bundle。
 */

const contentDir = fileURLToPath(new URL('../content', import.meta.url))

function readContentFiles(collection: string, extension: string) {
  return readdirSync(join(contentDir, collection))
    .filter(file => file.endsWith(extension))
    .map(file => ({
      file: `content/${collection}/${file}`,
      source: readFileSync(join(contentDir, collection, file), 'utf8'),
    }))
}

/**
 * 只取路由需要的幾個欄位，因此用正則直接讀，不為了 build 設定多裝一套 parser。
 * 對應的是 yml 與 md frontmatter 裡最單純的 `key: value` 寫法。
 */
function readField(source: string, field: string) {
  const matched = source.match(new RegExp(`^${field}:[ \\t]*(.+?)[ \\t]*$`, 'm'))

  return matched?.[1]?.replace(/^(["'])(.*)\1$/, '$2')
}

function requireField(entry: { file: string, source: string }, field: string) {
  const value = readField(entry.source, field)

  if (!value)
    throw new Error(`[content-routes] ${entry.file} 缺少 ${field} 欄位`)

  return value
}

/** 已公開的講者 talkSlug；draft 的不列入，順序比照 talkNumber */
const speakerSlugs: string[] = readContentFiles('speakers', '.md')
  .filter(entry => readField(entry.source, 'draft') !== 'true')
  .map(entry => ({
    slug: requireField(entry, 'talkSlug'),
    order: Number(requireField(entry, 'talkNumber')),
  }))
  .toSorted((a, b) => a.order - b.order)
  .map(({ slug }) => slug)

/** 講者介紹（/speakers/[talkSlug]） */
export const speakerRoutes: string[] = speakerSlugs.map(
  slug => `/speakers/${slug}`,
)

/** 議程彈窗（/agenda/[talkSlug]），id 與講者的 talkSlug 相同 */
export const agendaRoutes: string[] = speakerSlugs.map(
  slug => `/agenda/${slug}`,
)

/** 籌備團隊成員（/team/[slug]）；順序比照列表上的 order */
export const teamRoutes: string[] = readContentFiles('team', '.yml')
  .map(entry => ({
    slug: requireField(entry, 'slug'),
    order: Number(requireField(entry, 'order')),
  }))
  .toSorted((a, b) => a.order - b.order)
  .map(({ slug }) => `/team/${slug}`)

/**
 * sitemap 的 lastmod 由人工維護：檔案 mtime 在 CI 上是 clone 時間，不能代表內容更新日。
 * 講者或成員資料有實質更新時，改這幾個日期。
 */
const speakerLastmod = '2026-08-16'
const agendaLastmod = '2026-08-31'
const teamLastmod = '2026-08-24'

/** 併進 config/seo.config.ts 的 sitemap.urls（在 nuxt.config 組合） */
export const contentSitemapUrls = [
  ...speakerRoutes.map(loc => ({ loc, priority: 0.8, lastmod: speakerLastmod })),
  ...agendaRoutes.map(loc => ({ loc, priority: 0.8, lastmod: agendaLastmod })),
  ...teamRoutes.map(loc => ({ loc, priority: 0.8, lastmod: teamLastmod })),
]
