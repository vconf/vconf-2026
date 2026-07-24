export interface Sponsor {
  name: string
  logo: string
  width: number
  height: number
}

export interface SponsorGroup {
  level: 10 | 5 | 3 | 1
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
        name: '新加坡商鈦坦科技',
        logo: '/sponsors/titansoft.svg',
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
        width: 228,
        height: 141,
      },
      {
        name: '雷麒科技有限公司',
        logo: '/sponsors/leichi.svg',
        width: 233,
        height: 232,
      },
    ],
  },
  {
    level: 1,
    label: '1x Sponsor',
    sponsors: [
      {
        name: '來一課線上學院',
        logo: '/sponsors/bluemonkey.svg',
        width: 156,
        height: 156,
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
