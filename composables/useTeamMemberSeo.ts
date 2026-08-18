import type { TeamMember } from '~/config/team'

type TeamMemberSeoInput = TeamMember | null | undefined

export interface UseTeamMemberSeoOptions {
  /** 沒有指定成員時（團隊列表本身）的標題 */
  fallbackTitle?: string
  robots?: string
}

/**
 * 成員彈窗的 title 與結構化資料。
 * title 隨網址切換更新；schema 比照 useSpeakerSeo，由 SSR 輸出初始值。
 * OG／Twitter 等 meta 沿用全站預設，這裡不覆寫。
 */
export function useTeamMemberSeo(
  member: MaybeRefOrGetter<TeamMemberSeoInput>,
  options: UseTeamMemberSeoOptions = {},
) {
  const seo = computed(() =>
    buildTeamMemberSeo(toValue(member), { fallbackTitle: options.fallbackTitle }),
  )

  useSeoMeta({
    title: () => seo.value.title,
    robots: options.robots,
  })

  useSchemaOrg([
    ...seo.value.schema,
    // 成員彈窗的網址代表「某個人的介紹頁」，把預設 WebPage 換成 ProfilePage
    ...(seo.value.personId
      ? [
          defineWebPage({
            '@type': 'ProfilePage',
            'mainEntity': { '@id': seo.value.personId },
          }),
        ]
      : []),
  ])

  return seo
}
