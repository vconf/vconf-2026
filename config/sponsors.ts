export interface Sponsor {
  name: string
  logo: string
  url?: string
  width: number
  height: number
  backgroundClass?: string
}

/** 'thanks' 是 Special Thanks 版位，不是贊助級別，所以不用數字 */
export interface SponsorGroup {
  level: 10 | 5 | 3 | 1 | 'thanks'
  label: string
  sponsors: Sponsor[]
}

export const sponsorGroups: SponsorGroup[] = [
  {
    level: 10,
    label: '10x Sponsor',
    sponsors: [],
  },
  {
    level: 5,
    label: '5x Sponsor',
    sponsors: [
      {
        name: 'TITANSOFT',
        logo: '/sponsors/titansoft.svg',
        url: 'https://titansoft.com/tw',
        width: 260,
        height: 218,
      },
    ],
  },
  {
    level: 3,
    label: '3x Sponsor',
    sponsors: [
      {
        name: '六角學院 Hexschool',
        logo: '/sponsors/hexschool.svg',
        url: 'https://www.hexschool.com/',
        width: 228,
        height: 141,
      },
      {
        name: '雷麒科技有限公司',
        logo: '/sponsors/leichi.svg',
        url: 'https://www.lctech.com.tw/',
        width: 233,
        height: 232,
      },
      {
        name: '104 人力銀行',
        logo: '/sponsors/104.svg',
        url: 'https://www.104.com.tw/',
        width: 181,
        height: 146,
        backgroundClass: 'bg-sponsor-104',
      },
      {
        name: 'WISH甜心私覓',
        logo: '/sponsors/wish_v2.svg',
        url: 'https://wish.cat/',
        width: 480,
        height: 256,
      },
    ],
  },
  {
    level: 1,
    label: '1x Sponsor',
    sponsors: [
      {
        name: 'teacher.place',
        logo: '/sponsors/bluemonkey-2.svg',
        url: 'https://teacher.place/?openExternalBrowser=1',
        width: 156,
        height: 156,
      },
    ],
  },
  {
    level: 'thanks',
    label: 'Special Thanks',
    sponsors: [
      {
        name: 'The CodingPro',
        logo: '/sponsors/theCodingPro.svg',
        url: 'https://thecodingpro.com/',
        width: 116,
        height: 116,
      },
    ],
  },
]

export const visibleSponsorGroups = sponsorGroups.filter(
  group => group.sponsors.length > 0,
)

export const homeSponsorGroups = sponsorGroups
  .slice(0, 3)
  .filter(group => group.sponsors.length > 0)
