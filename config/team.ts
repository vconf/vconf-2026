import type { TeamCollectionItem } from '@nuxt/content'

/**
 * 籌備團隊的型別與衍生邏輯；成員資料放在 content/team/*.yml，
 * schema 定義在 content.config.ts，由 useTeamMembers() 取用。
 *
 * 這裡的函式都是純函式，可以在元件、composable 與 utils/seo.ts 共用。
 */

/** 組別在頁面上的排列順序，同時是 content schema 的合法值 */
export const teamGroupOrder = [
  '總召組',
  '議程組',
  '行銷組',
  '贊助組',
  '場務組',
  '開發組',
] as const

/** 組內職務，同時是 content schema 的合法值 */
export const teamRoles = ['總召', '組長', '組員'] as const

export type TeamName = (typeof teamGroupOrder)[number]
export type TeamRole = (typeof teamRoles)[number]

export interface TeamMemberRole {
  team: TeamName
  role: TeamRole
}

/** 成員資料的單一來源是 content/team/*.yml，schema 在 content.config.ts */
export type TeamMember = TeamCollectionItem

/** 分組後的成員，role 是該組實際職務 */
export interface TeamGroupMember extends TeamMember {
  role: TeamRole
}

export interface TeamGroup {
  title: TeamName
  members: TeamGroupMember[]
}

/** 成員在各組的職務，依 teamGroupOrder 排序，不受 yml 內 teams 的書寫順序影響 */
export function teamMemberRoles(member: TeamMember): TeamMemberRole[] {
  return teamGroupOrder.flatMap((title) => {
    const team = member.teams.find(item => item.name === title)

    return team ? [{ team: title, role: team.role }] : []
  })
}

export function teamRoleLabel({ team, role }: TeamMemberRole): string {
  return role === '總召' ? role : `${team}${role}`
}

/**
 * 依 teamGroupOrder 分組；跨組成員會出現在各自所屬的每一組，
 * 組內順序由成員的 order 決定。
 */
export function groupTeamMembers(members: TeamMember[]): TeamGroup[] {
  const sorted = members.toSorted((a, b) => a.order - b.order)

  return teamGroupOrder
    .map(title => ({
      title,
      members: sorted.flatMap((member) => {
        const team = member.teams.find(item => item.name === title)

        return team ? [{ ...member, role: team.role }] : []
      }),
    }))
    .filter(group => group.members.length > 0)
}

/** 依 slug 取得成員，供成員彈窗（/team/[slug]）使用 */
export function findTeamMember(
  members: TeamMember[] | null | undefined,
  slug: string,
): TeamMember | undefined {
  return members?.find(member => member.slug === slug)
}

export type TeamPhotoKind = 'avatar' | 'popup' | 'popupMobile'

/** 取照片只需要三個圖檔欄位，TeamMember 與 TeamGroupMember 都適用 */
export type TeamPhotoSource = Pick<
  TeamMember,
  'avatar' | 'popupAvatar' | 'popupAvatarMobile'
>

/**
 * 取成員照片；三種尺寸分別對應列表頭像、彈窗桌機、彈窗手機。
 * 缺彈窗專用圖時退回列表頭像；連頭像都沒有的成員回傳 undefined，由畫面以名稱首字遞補。
 */
export function teamPhoto(
  member: TeamPhotoSource,
  kind: TeamPhotoKind,
): string | undefined {
  if (kind === 'popup')
    return member.popupAvatar ?? member.avatar

  if (kind === 'popupMobile')
    return member.popupAvatarMobile ?? member.avatar

  return member.avatar
}
