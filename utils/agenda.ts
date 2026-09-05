import type { SpeakersCollectionItem } from '@nuxt/content'

export interface SpeakerSummary {
  name: string
  jobTitle: string
  /** 預設／桌機講者照 */
  avatar: string
  /** 手機版講者照（講者介紹頁） */
  avatarMobile?: string
  /** 議程列表圓形頭像 */
  agendaAvatar?: string
  /** 議程彈窗桌機講者照 */
  modalAvatar?: string
  /** 議程彈窗手機圓形頭像 */
  modalAvatarMobile?: string
  /** 講者彈窗桌機講者照（333×560） */
  profileAvatar?: string
  /** 講者彈窗手機講者照（260×370） */
  profileAvatarMobile?: string
  avatarAlt: string
}

export interface TalkItem {
  type: 'talk'
  time: string
  endTime: string
  talkNumber: number
  title: string
  speaker: SpeakerSummary | SpeakersCollectionItem
  /** 英文 slug，作為網址 id（避免中文網址） */
  slug: string
}

export interface BreakItem {
  type: 'break'
  time: string
  label: string
  theme: 'gray' | 'purple' | 'primary'
}

export type AgendaItem = TalkItem | BreakItem

const placeholderAvatar
  = 'https://images.unsplash.com/photo-1778844648458-129cfdf980a6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

function confirmedTalk(speaker: SpeakersCollectionItem): TalkItem {
  return {
    type: 'talk',
    time: speaker.startTime,
    endTime: speaker.endTime,
    talkNumber: speaker.talkNumber,
    slug: speaker.talkSlug,
    title: speaker.topic,
    speaker,
  }
}

function placeholderTalk(
  talkNumber: number,
  time: string,
  endTime: string,
  slug: string,
  name: string,
): TalkItem {
  return {
    type: 'talk',
    time,
    endTime,
    talkNumber,
    slug,
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: {
      name,
      jobTitle: '講者資訊準備中',
      avatar: placeholderAvatar,
      avatarAlt: `${name} 頭像`,
    },
  }
}

export function createAgendaItems(
  speakers: SpeakersCollectionItem[],
): AgendaItem[] {
  const talkByNumber = new Map(
    speakers.map(speaker => [speaker.talkNumber, confirmedTalk(speaker)]),
  )

  return [
    talkByNumber.get(1)
    ?? placeholderTalk(1, '09:30', '10:15', 'evan-you', 'Evan You'),
    { type: 'break', time: '10:15', label: '休息一下', theme: 'gray' },
    talkByNumber.get(2)
    ?? placeholderTalk(2, '10:30', '11:15', 'serko', 'SerKo'),
    { type: 'break', time: '11:15', label: '休息一下', theme: 'gray' },
    talkByNumber.get(3)
    ?? placeholderTalk(3, '11:30', '12:15', 'hunter', 'Hunter'),
    { type: 'break', time: '12:15', label: '午餐', theme: 'purple' },
    talkByNumber.get(4)
    ?? placeholderTalk(4, '13:15', '14:00', 'kuku', 'KuKu'),
    { type: 'break', time: '14:00', label: '休息一下', theme: 'gray' },
    talkByNumber.get(5)
    ?? placeholderTalk(5, '14:15', '15:00', 'ray', 'Ray'),
    { type: 'break', time: '15:00', label: '點心', theme: 'purple' },
    talkByNumber.get(6)
    ?? placeholderTalk(6, '15:15', '16:00', 'kuro', 'Kuro'),
    { type: 'break', time: '16:00', label: '閉幕', theme: 'primary' },
  ]
}

export const breakThemeClass: Record<BreakItem['theme'], string> = {
  gray: 'bg-vconf-gray-ultralight rounded-[24px]',
  purple: 'bg-vconf-purple-ultralight rounded-[24px]',
  primary: 'bg-vconf-primary-light rounded-[24px]',
}

export function agendaTalkId(talk: TalkItem): string {
  return talk.slug
}

export function findAgendaTalkById(
  agendaItems: AgendaItem[],
  id: string,
): TalkItem | null {
  for (const item of agendaItems) {
    if (item.type === 'talk' && item.slug === id)
      return item
  }

  return null
}

export type AnySpeaker = SpeakerSummary | SpeakersCollectionItem

/**
 * 講者照的使用場景，每個場景有自己的裁切比例與圖檔尺寸：
 * - `introMobile`：講者介紹頁（手機）
 * - `agenda`：議程列表圓形頭像
 * - `modal`：議程彈窗（桌機直式）
 * - `modalMobile`：議程彈窗（手機圓形）
 * - `profile`：講者彈窗（桌機 333×560）
 * - `profileMobile`：講者彈窗（手機 260×370）
 *
 * 桌機版講者介紹頁直接用 `avatar`，不需要經過 speakerPhoto()。
 */
export type SpeakerPhotoSlot
  = | 'introMobile'
    | 'agenda'
    | 'modal'
    | 'modalMobile'
    | 'profile'
    | 'profileMobile'

/**
 * 取指定場景的講者照。
 * 該場景沒有專屬圖檔時（佔位講者、尚未提供的講者）退回同裝置的
 * 講者介紹照，最後一定退到 avatar，畫面不會缺圖。
 */
export function speakerPhoto(
  speaker: AnySpeaker,
  slot: SpeakerPhotoSlot,
): string {
  switch (slot) {
    case 'introMobile':
      return speaker.avatarMobile ?? speaker.avatar
    case 'agenda':
      return speaker.agendaAvatar ?? speaker.avatar
    case 'modal':
      return speaker.modalAvatar ?? speaker.avatar
    case 'modalMobile':
      return speaker.modalAvatarMobile ?? speaker.avatarMobile ?? speaker.avatar
    // 退回順序按裁切比例的接近程度挑：議程彈窗桌機照 253×400 比 avatar 306×433 接近 333×560
    case 'profile':
      return speaker.profileAvatar ?? speaker.modalAvatar ?? speaker.avatar
    // avatarMobile 169×239 與 260×370 幾乎同比例，modalAvatarMobile 是圓形裁切不能用
    case 'profileMobile':
      return (
        speaker.profileAvatarMobile ?? speaker.avatarMobile ?? speaker.avatar
      )
  }
}

export function isContentSpeaker(
  speaker: SpeakerSummary | SpeakersCollectionItem,
): speaker is SpeakersCollectionItem {
  return 'speakerId' in speaker
}

/**
 * 同一個圖示出現多次時（例如個人網站與宣傳連結共用地球圖示）光看圖示分不出是哪一個，
 * 只有這些連結需要 tooltip；其餘社群圖示本身就足以辨識，tip 留空表示不顯示。
 */
export function withDuplicateIconTips<T extends { icon: string, text: string }>(
  links: T[],
): Array<T & { tip: string }> {
  const count = new Map<string, number>()

  for (const link of links)
    count.set(link.icon, (count.get(link.icon) ?? 0) + 1)

  return links.map(link => ({
    ...link,
    tip: (count.get(link.icon) ?? 0) > 1 ? link.text : '',
  }))
}

const PROMO_LINK_LABEL = '希望宣傳連結'

/**
 * 社群圖示只有圖沒有文字，aria-label 得單獨交代這條連結是什麼。
 * tip 只有同一個圖示重複時才有值，用來區分是哪一條。
 */
export function socialLinkAriaLabel(link: {
  label: string
  text: string
  tip?: string
}): string {
  if (link.label === PROMO_LINK_LABEL)
    return link.text || link.label

  return link.tip ? `${link.label}：${link.tip}` : link.label
}
