export type TeamName = '總召組' | '議程組' | '行銷組' | '贊助組' | '場務組'
export type TeamRole = '總召' | '組長' | '組員'

export interface TeamMemberLinks {
  website?: string
  facebook?: string
  instagram?: string
  x?: string
  threads?: string
}

export interface TeamMember {
  /** 英文 slug，同時是圖檔檔名 */
  slug: string
  name: string
  /** 所屬組別，可跨組（例：組長兼總召組） */
  teams: TeamName[]
  /** 個人層級職務標記，目前僅總召需要；未標記者由組內排序推導組長／組員 */
  role?: Extract<TeamRole, '總召'>
  /** 職稱 */
  jobTitle: string
  company?: string
  /** 自我介紹，供成員彈窗使用 */
  bio?: string
  links?: TeamMemberLinks
  /** 列表圓形頭像（211×211）；未提供照片者留空，畫面上以名稱首字遞補 */
  avatar?: string
  /** 彈窗桌機直式照（333×506） */
  popupAvatar?: string
  /** 彈窗手機圓形頭像（149×149） */
  popupAvatarMobile?: string
}

/** 分組後的成員，role 已解析成該組實際職務 */
export interface TeamGroupMember extends Omit<TeamMember, 'role'> {
  role: TeamRole
}

export interface TeamGroup {
  title: TeamName
  members: TeamGroupMember[]
}

/** 組別在頁面上的排列順序 */
export const teamGroupOrder: TeamName[] = [
  '總召組',
  '議程組',
  '行銷組',
  '贊助組',
  '場務組',
]

export const teamMembers: TeamMember[] = [
  {
    slug: 'alex-liu',
    name: 'Alex Liu',
    teams: ['總召組'],
    role: '總召',
    jobTitle: '資深前端工程師',
    company: '網際網路相關業',
    bio: '嗨！我是 Alex Liu，一個沉浸在前端網頁技術的 nerd，主要專注在 Vue 與 Nuxt。除了前端技術外，最大的興趣應該就是吸貓了！',
    links: { website: 'https://mini-ghost.dev/' },
    avatar: '/team/avatar/alex-liu.jpg',
    popupAvatarMobile: '/team/popup-mobile/alex-liu.jpg',
  },
  {
    slug: 'anan',
    name: '安安',
    teams: ['總召組', '議程組'],
    jobTitle: 'AI 安撫工程師',
    company: '104 人力銀行',
    bio: '嗨，我是 IlyaL，我是一名開源愛好者，喜歡到處貢獻 :p',
    links: {
      website: 'https://ilyal.me/',
      x: 'https://x.com/ilyaliao',
      threads: 'https://www.threads.com/@ilya.liao',
    },
    avatar: '/team/avatar/anan.jpg',
    popupAvatar: '/team/popup-desktop/anan.jpg',
    popupAvatarMobile: '/team/popup-mobile/anan.jpg',
  },
  {
    slug: 'sova-yu',
    name: 'Sova Yu',
    teams: ['議程組'],
    jobTitle: '工程師',
    company: '旅宿系統相關產業',
    bio: '前端工程師，喜歡看書，最近很喜歡蕭詒徽的《葛莉蕬的安安》',
    avatar: '/team/avatar/sova-yu.png',
    popupAvatar: '/team/popup-desktop/sova-yu.png',
    popupAvatarMobile: '/team/popup-mobile/sova-yu.png',
  },
  {
    slug: 'meinan',
    name: '美男',
    teams: ['議程組'],
    jobTitle: '前端工程師',
    bio: '最近在 React 轉圈圈中... 之好想滑到粉雪哇 ( ´-ω ･)▄︻┻┳══━',
    avatar: '/team/avatar/meinan.png',
    popupAvatar: '/team/popup-desktop/meinan.png',
    popupAvatarMobile: '/team/popup-mobile/meinan.png',
  },
  {
    slug: 'rafael',
    name: 'Rafael',
    teams: ['議程組'],
    jobTitle: '前端工程師',
    company: '日照服務產業',
    bio: '嗨，我是 Rafael，穿梭於程式邏輯與百岳山林之間',
    avatar: '/team/avatar/rafael.jpg',
    popupAvatar: '/team/popup-desktop/rafael.png',
    popupAvatarMobile: '/team/popup-mobile/rafael.jpg',
  },
  {
    slug: 'benny',
    name: 'Benny',
    teams: ['議程組'],
    jobTitle: '工程師',
    bio: '突然發現我是被一群前端包圍的後端工程師 XD',
    avatar: '/team/avatar/benny.jpg',
  },
  {
    slug: 'hannah',
    name: 'Hannah',
    teams: ['行銷組'],
    jobTitle: '工程師',
    company: '上市櫃公司',
    bio: '一名熱愛旅行的前端工程師',
    avatar: '/team/avatar/hannah.webp',
    popupAvatar: '/team/popup-desktop/hannah.png',
    popupAvatarMobile: '/team/popup-mobile/hannah.png',
  },
  {
    slug: 'z',
    name: 'z',
    teams: ['行銷組'],
    jobTitle: '不是工程師',
    bio: '希望能成為不會餓死的文藝復興人 😌',
    avatar: '/team/avatar/z.png',
    popupAvatar: '/team/popup-desktop/z.png',
    popupAvatarMobile: '/team/popup-mobile/z.png',
  },
  {
    slug: 'chilun',
    name: '七倫',
    teams: ['行銷組'],
    jobTitle: '努力上岸的工程師',
    bio: '努力排上岸的前端工程師',
    avatar: '/team/avatar/chilun.png',
    popupAvatar: '/team/popup-desktop/chilun.png',
    popupAvatarMobile: '/team/popup-mobile/chilun.png',
  },
  {
    slug: 'mo',
    name: '墨同學',
    teams: ['行銷組'],
    jobTitle: '詠唱工程師',
    company: '玄宇數位',
    bio: '大家好，我是墨同學，正在練習把牛變成鱒魚的前端工程師',
    avatar: '/team/avatar/mo.jpg',
    popupAvatar: '/team/popup-desktop/mo.jpg',
    popupAvatarMobile: '/team/popup-mobile/mo.jpg',
  },
  {
    slug: 'mike',
    name: 'Mike',
    teams: ['總召組', '贊助組'],
    jobTitle: '資深前端工程師',
    company: '雷麒科技有限公司',
    bio: '可以找我滑雪跟打桌球',
    links: {
      website: 'https://thecodingpro.com/',
      facebook: 'https://www.facebook.com/cheng.zhi.yuan.33285/',
      instagram: 'https://www.instagram.com/mike_cheng1208/',
      threads: 'https://www.threads.com/@mike_cheng1208',
    },
    avatar: '/team/avatar/mike.png',
    popupAvatar: '/team/popup-desktop/mike.png',
    popupAvatarMobile: '/team/popup-mobile/mike.png',
  },
  {
    slug: 'noah',
    name: 'Noah',
    teams: ['總召組', '場務組'],
    jobTitle: '網站工程師',
    company: '104 人力銀行',
    bio: '愛吃拉麵的網站工程師，最近沈迷於 Balatro',
    avatar: '/team/avatar/noah.png',
  },
  {
    slug: 'wujue',
    name: 'Wujue',
    teams: ['場務組'],
    jobTitle: '前端工程師',
    company: '台達電子',
  },
]

/**
 * 依 teamGroupOrder 分組；跨組成員會出現在各自所屬的每一組。
 * 各組排第一位是組長、其餘為組員；已標記 role 的成員（總召）沿用自己的職務。
 */
export const teamGroups: TeamGroup[] = teamGroupOrder
  .map(title => ({
    title,
    members: teamMembers
      .filter(member => member.teams.includes(title))
      .map(({ role, ...member }, index): TeamGroupMember => ({
        ...member,
        role: role ?? (index === 0 ? '組長' : '組員'),
      })),
  }))
  .filter(group => group.members.length > 0)

/** 依 slug 取得成員，供成員彈窗（/team/[slug]）使用 */
export function findTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find(member => member.slug === slug)
}

export type TeamPhotoKind = 'avatar' | 'popup' | 'popupMobile'

/**
 * 取成員照片；三種尺寸分別對應列表頭像、彈窗桌機、彈窗手機。
 * 缺彈窗專用圖時退回列表頭像；連頭像都沒有的成員回傳 undefined，由畫面以名稱首字遞補。
 */
export function teamPhoto(
  member: TeamMember,
  kind: TeamPhotoKind,
): string | undefined {
  if (kind === 'popup')
    return member.popupAvatar ?? member.avatar

  if (kind === 'popupMobile')
    return member.popupAvatarMobile ?? member.avatar

  return member.avatar
}
