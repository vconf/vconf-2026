import type { SpeakersCollectionItem } from '@nuxt/content'
import type { SpeakerSeoType } from '~/config/seo.speakers.config'
import {
  absoluteUrl,
  eventBasic,
  eventLocation,
  eventOrganizer,
  site,
  siteImage,
} from '~/config/seo.config'
import { getSpeakerSeoOverride } from '~/config/seo.speakers.config'

export interface SpeakerSeoOptions {
  type: SpeakerSeoType
  /** 頁面路徑（相對），網域由 absoluteUrl() 補上 */
  path: string
  /** 沒有講者資料時（例如議程列表本身）使用的文案，未給則退回全站預設 */
  fallback?: {
    title?: string
    description?: string
  }
}

export interface SpeakerSeoMeta {
  title: string
  description: string
  ogUrl: string
  ogImage: string
  ogImageAlt: string
}

export interface SpeakerSeoResult {
  meta: SpeakerSeoMeta
  schema: Record<string, unknown>[]
}

/** 活動日期與時區都以 eventBasic 為單一來源，避免各處重複寫 2026-10-17 / +08:00 */
const eventDate = eventBasic.startDate.slice(0, 10)
const eventTimezone = eventBasic.startDate.slice(-6)

function personId(speaker: SpeakersCollectionItem) {
  return absoluteUrl(`#person/${speaker.speakerId}`)
}

function buildImageNode(id: string, url: string) {
  return {
    '@type': 'ImageObject',
    '@id': id,
    'url': absoluteUrl(url),
    'contentUrl': absoluteUrl(url),
    'inLanguage': site.defaultLocale,
  }
}

function buildPersonNode(speaker: SpeakersCollectionItem) {
  const node: Record<string, unknown> = {
    '@id': personId(speaker),
    '@type': 'Person',
    'name': speaker.name,
    'jobTitle': speaker.jobTitle,
    'description': speaker.speakerInfo,
    'image': buildImageNode(
      absoluteUrl(`#image/speaker-${speaker.speakerId}`),
      speaker.avatar,
    ),
  }

  // content 用 "-" 表示無所屬公司，這種值不該進結構化資料
  if (speaker.company && speaker.company !== '-') {
    node.worksFor = {
      '@type': 'Organization',
      'name': speaker.company,
    }
  }

  const sameAs = speaker.links.map(link => link.href).filter(Boolean)

  if (sameAs.length)
    node.sameAs = sameAs

  return node
}

function buildFallbackSeo(options: SpeakerSeoOptions): SpeakerSeoResult {
  return {
    meta: {
      title: options.fallback?.title ?? site.name,
      description: options.fallback?.description ?? site.description,
      ogUrl: absoluteUrl(options.path),
      ogImage: siteImage.url,
      ogImageAlt: siteImage.alt,
    },
    schema: [],
  }
}

/**
 * 由 content 的講者資料與個別覆寫，組出 meta 與 schema.org 節點。
 *
 * 純函式，不依賴 Nuxt composable，方便之後給 sitemap、OG 圖產生器重用。
 */
export function buildSpeakerSeo(
  speaker: SpeakersCollectionItem | null | undefined,
  options: SpeakerSeoOptions,
): SpeakerSeoResult {
  if (!speaker)
    return buildFallbackSeo(options)

  const override = getSpeakerSeoOverride(speaker.talkSlug)
  const title = override.title
    ?? (options.type === 'agenda'
      ? `${speaker.name}｜${speaker.topic}`
      : speaker.name)
  const description = override.description ?? speaker.speakerInfo
  const ogUrl = absoluteUrl(options.path)
  const ogImage = override.ogImage ? absoluteUrl(override.ogImage) : siteImage.url
  const ogImageAlt = override.ogImageAlt ?? speaker.name

  const meta: SpeakerSeoMeta = {
    title,
    description,
    ogUrl,
    ogImage,
    ogImageAlt,
  }

  const schema: Record<string, unknown>[] = [buildPersonNode(speaker)]

  if (options.type !== 'agenda')
    return { meta, schema }

  // Event 會參照 #location 與 #organization。
  // #organization 已由 layouts/default.vue 全站注入，這裡再輸出一次會讓
  // 相同 @id 的節點合併時把 sameAs 之類的陣列串接成重複值，所以只補 #location。
  schema.push(eventLocation, {
    '@id': absoluteUrl(`#event/${speaker.talkSlug}`),
    '@type': 'Event',
    'name': speaker.topic,
    'description': description,
    'image': buildImageNode(
      absoluteUrl(`#og-image/${speaker.talkSlug}`),
      ogImage,
    ),
    'startDate': `${eventDate}T${speaker.startTime}:00${eventTimezone}`,
    'endDate': `${eventDate}T${speaker.endTime}:00${eventTimezone}`,
    'eventStatus': eventBasic.eventStatus,
    'eventAttendanceMode': eventBasic.eventAttendanceMode,
    'inLanguage': site.defaultLocale,
    'url': ogUrl,
    'location': { '@id': eventLocation['@id'] },
    'organizer': { '@id': eventOrganizer['@id'] },
    'performer': { '@id': personId(speaker) },
    'superEvent': eventBasic,
  })

  return { meta, schema }
}
