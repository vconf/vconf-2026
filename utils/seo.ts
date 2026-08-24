import type { SpeakersCollectionItem } from '@nuxt/content'
import type { SpeakerSeoType } from '~/config/seo.speakers.config'
import type { TeamMember } from '~/config/team'
import {
  absoluteUrl,
  eventBasic,
  eventLocation,
  eventOrganizer,
  site,
  siteImage,
} from '~/config/seo.config'
import { getSpeakerSeoOverride } from '~/config/seo.speakers.config'
import { findTeamMemberRoles, teamPhoto, teamRoleLabel } from '~/config/team'

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
  ogImageWidth: number
  ogImageHeight: number
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

/**
 * speakerInfo 在 content 裡用換行分段（彈窗會以 pre-line 呈現），
 */
function toSingleLine(text: string) {
  return text.replace(/\s*\n\s*/g, '').trim()
}

function buildPersonNode(speaker: SpeakersCollectionItem) {
  const node: Record<string, unknown> = {
    '@id': personId(speaker),
    '@type': 'Person',
    'name': speaker.name,
    'jobTitle': speaker.jobTitle,
    'description': toSingleLine(speaker.speakerInfo),
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
      ogImageWidth: siteImage.width,
      ogImageHeight: siteImage.height,
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
  const description = override.description ?? toSingleLine(speaker.speakerInfo)
  const ogUrl = absoluteUrl(options.path)
  const ogImage = override.ogImage ? absoluteUrl(override.ogImage) : siteImage.url
  const ogImageAlt = override.ogImageAlt ?? speaker.name
  // 自訂 OG 圖與全站預設圖比例不同，出圖時連同尺寸一起覆寫；沒填就沿用全站尺寸
  const ogImageWidth = override.ogImageWidth ?? siteImage.width
  const ogImageHeight = override.ogImageHeight ?? siteImage.height

  const meta: SpeakerSeoMeta = {
    title,
    description,
    ogUrl,
    ogImage,
    ogImageAlt,
    ogImageWidth,
    ogImageHeight,
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

export interface TeamMemberSeoResult {
  /** 頁面標題（不含站名，站名由 titleTemplate 補上） */
  title: string
  description: string
  /** ProfilePage 自身的短描述，不與 Person 的自我介紹混用 */
  pageDescription: string
  ogTitle: string
  ogUrl: string
  schema: Record<string, unknown>[]
  /** Person 節點的 @id，供頁面把 ProfilePage 的 mainEntity 指過來 */
  personId?: string
}

/** 團隊成員與講者可能是同一人，@id 加前綴避免兩邊節點互相覆蓋 */
function teamPersonId(member: TeamMember) {
  return absoluteUrl(`#person/team-${member.slug}`)
}

function teamMemberUrl(member: TeamMember) {
  return absoluteUrl(`team/${member.slug}`)
}

function teamMemberDisplayName(member: TeamMember) {
  return member.alias ? `${member.name}（${member.alias}）` : member.name
}

function buildTeamPageDescription(member: TeamMember) {
  const rolePriority = { 總召: 0, 組長: 1, 組員: 2 } as const
  const roles = findTeamMemberRoles(member.slug)
    .toSorted((a, b) => rolePriority[a.role] - rolePriority[b.role])
    .map(teamRoleLabel)
  const details = [
    roles.length ? `${site.name} ${roles.join('、')}` : site.name,
    member.company ? `現職 ${member.company}` : member.jobTitle,
  ]

  return `${teamMemberDisplayName(member)}，${details.join('，')}。`
}

function buildTeamMetaDescription(member: TeamMember, pageDescription: string) {
  if (member.seoDescription)
    return member.seoDescription

  return member.bio
    ? `${pageDescription}${toSingleLine(member.bio)}`
    : pageDescription
}

function buildTeamPersonNode(member: TeamMember) {
  const node: Record<string, unknown> = {
    '@id': teamPersonId(member),
    '@type': 'Person',
    'name': member.name,
    'jobTitle': member.jobTitle,
  }

  // Person.description 就是「這個人的自我描述」，直接用成員自己寫的自我介紹；沒寫就不輸出
  if (member.bio)
    node.description = toSingleLine(member.bio)

  const photo = teamPhoto(member, 'popup')

  if (photo)
    node.image = buildImageNode(absoluteUrl(`#image/team-${member.slug}`), photo)

  if (member.company) {
    node.worksFor = {
      '@type': 'Organization',
      'name': member.company,
    }
  }

  const sameAs = Object.values(member.links ?? {}).filter(Boolean)

  if (sameAs.length)
    node.sameAs = sameAs

  // Role 節點才能同時表達「隸屬 Vue.js Taiwan」與「在籌備團隊擔任的職務」
  const roles = findTeamMemberRoles(member.slug)

  if (roles.length) {
    node.memberOf = roles.map(role => ({
      '@type': 'OrganizationRole',
      'roleName': teamRoleLabel(role),
      'memberOf': { '@id': eventOrganizer['@id'] },
    }))
  }

  return node
}

/**
 * 由 config/team.ts 的成員資料組出成員彈窗的標題與 schema.org 節點。
 *
 * 與 buildSpeakerSeo() 一樣是純函式，不依賴 Nuxt composable。
 */
export function buildTeamMemberSeo(
  member: TeamMember | null | undefined,
  options: { fallbackTitle?: string } = {},
): TeamMemberSeoResult {
  if (!member) {
    return {
      title: options.fallbackTitle ?? site.name,
      description: site.description,
      pageDescription: site.description,
      ogTitle: site.name,
      ogUrl: absoluteUrl('team'),
      schema: [],
    }
  }

  const title = member.name
  const pageDescription = buildTeamPageDescription(member)

  return {
    title,
    description: buildTeamMetaDescription(member, pageDescription),
    pageDescription,
    ogTitle: `${title}｜${site.name}`,
    ogUrl: teamMemberUrl(member),
    schema: [buildTeamPersonNode(member)],
    personId: teamPersonId(member),
  }
}
