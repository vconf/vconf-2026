export interface Speaker {
  name: string
  title: string
  avatar: string
  avatarAlt: string
}

export interface TalkItem {
  type: 'talk'
  time: string
  talkNumber: number
  title: string
  speaker: Speaker
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

export const agendaItems: AgendaItem[] = [
  {
    type: 'talk',
    time: '09:30',
    talkNumber: 1,
    slug: 'evan-you',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: '尤雨溪', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: '尤雨溪頭像' },
  },
  { type: 'break', time: '10:15', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '10:25',
    talkNumber: 2,
    slug: 'hunter',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: 'Hunter', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: 'Hunter 頭像' },
  },
  { type: 'break', time: '11:10', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '11:20',
    talkNumber: 3,
    slug: 'serko',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: 'SerKo', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: 'SerKo 頭像' },
  },
  { type: 'break', time: '12:05', label: '午餐', theme: 'purple' },
  {
    type: 'talk',
    time: '13:05',
    talkNumber: 4,
    slug: 'kuku-1',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: 'KuKu', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: 'KuKu頭像' },
  },
  { type: 'break', time: '13:50', label: '休息一下', theme: 'gray' },
  {
    type: 'talk',
    time: '14:00',
    talkNumber: 5,
    slug: 'kuku-2',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: 'KuKu', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: 'KuKu頭像' },
  },
  { type: 'break', time: '14:45', label: '點心', theme: 'purple' },
  {
    type: 'talk',
    time: '15:15',
    talkNumber: 6,
    slug: 'alex',
    title: '我們如何將資料從父層 Component 傳遞到子層 Component ？',
    speaker: { name: 'Alex 宅幹嘛', title: 'Creator of Vue.js', avatar: placeholderAvatar, avatarAlt: 'Alex 宅幹嘛頭像' },
  },
  { type: 'break', time: '16:00', label: '閉幕', theme: 'primary' },
]

export const breakThemeClass: Record<BreakItem['theme'], string> = {
  gray: 'bg-vconf-gray-ultralight rounded-[24px]',
  purple: 'bg-vconf-purple-ultralight rounded-[24px]',
  primary: 'bg-vconf-primary-light rounded-[24px]',
}

export function agendaTalkId(talk: TalkItem): string {
  return talk.slug
}

export function findAgendaTalkById(id: string): TalkItem | null {
  for (const item of agendaItems) {
    if (item.type === 'talk' && item.slug === id)
      return item
  }

  return null
}
