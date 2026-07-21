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
        name: 'TITANSOFT',
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
        name: '六角學院',
        logo: '/sponsors/hexschool.svg',
        width: 228,
        height: 141,
      },
      {
        name: '雷霆',
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
        name: '一客學院',
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
