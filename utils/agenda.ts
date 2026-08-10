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
      jobTitle: 'Creator of Vue.js',
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
    ?? placeholderTalk(1, '09:30', '10:15', 'evan-you', '尤雨溪'),
    { type: 'break', time: '10:15', label: '休息一下', theme: 'gray' },
    talkByNumber.get(2)
    ?? placeholderTalk(2, '10:25', '11:10', 'hunter', 'Hunter'),
    { type: 'break', time: '11:10', label: '休息一下', theme: 'gray' },
    talkByNumber.get(3)
    ?? placeholderTalk(3, '11:20', '12:05', 'serko', 'SerKo'),
    { type: 'break', time: '12:05', label: '午餐', theme: 'purple' },
    talkByNumber.get(4)
    ?? placeholderTalk(4, '13:05', '13:50', 'kuku', 'kuku'),
    { type: 'break', time: '13:50', label: '休息一下', theme: 'gray' },
    talkByNumber.get(5)
    ?? placeholderTalk(5, '14:00', '14:45', 'talk-5', '講者待公布'),
    { type: 'break', time: '14:45', label: '點心', theme: 'purple' },
    talkByNumber.get(6)
    ?? placeholderTalk(6, '15:15', '16:00', 'ray', 'Ray'),
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

type AnySpeaker = SpeakerSummary | SpeakersCollectionItem

/**
 * 講者照的使用場景，每個場景有自己的裁切比例與圖檔尺寸：
 * - `introMobile`：講者介紹頁（手機）
 * - `agenda`：議程列表圓形頭像
 * - `modal`：議程彈窗（桌機直式）
 * - `modalMobile`：議程彈窗（手機圓形）
 *
 * 桌機版講者介紹頁直接用 `avatar`，不需要經過 speakerPhoto()。
 */
export type SpeakerPhotoSlot = 'introMobile' | 'agenda' | 'modal' | 'modalMobile'

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
  }
}

export function isContentSpeaker(
  speaker: SpeakerSummary | SpeakersCollectionItem,
): speaker is SpeakersCollectionItem {
  return 'speakerId' in speaker
}
