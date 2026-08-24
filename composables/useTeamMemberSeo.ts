import type { TeamMember } from '~/config/team'
import { siteImage } from '~/config/seo.config'

type TeamMemberSeoInput = TeamMember | null | undefined

export interface UseTeamMemberSeoOptions {
  /** 沒有指定成員時（團隊列表本身）的標題 */
  fallbackTitle?: string
  robots?: string
}

/**
 * 成員彈窗的 title 與結構化資料。
 * title 隨網址切換更新；schema 比照 useSpeakerSeo，由 SSR 輸出初始值。
 * meta／OG／Twitter 描述個人頁；Person.description 則保留成員本人的自我介紹。
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
    description: () => seo.value.description,
    ogTitle: () => seo.value.ogTitle,
    ogDescription: () => seo.value.description,
    ogUrl: () => seo.value.ogUrl,
    ogImage: siteImage.url,
    ogImageAlt: siteImage.alt,
    ogImageWidth: siteImage.width,
    ogImageHeight: siteImage.height,
    ogImageType: 'image/png',
    twitterCard: 'summary_large_image',
    twitterTitle: () => seo.value.ogTitle,
    twitterDescription: () => seo.value.description,
    twitterImage: siteImage.url,
    twitterImageAlt: siteImage.alt,
    robots: options.robots,
  })

  useSchemaOrg([
    ...seo.value.schema,
    // 成員彈窗的網址代表「某個人的介紹頁」，把預設 WebPage 換成 ProfilePage
    ...(seo.value.personId
      ? [
          defineWebPage({
            '@id': `${seo.value.ogUrl}#webpage`,
            '@type': ['WebPage', 'ProfilePage'],
            'name': seo.value.ogTitle,
            'description': seo.value.pageDescription,
            'url': seo.value.ogUrl,
            'mainEntity': { '@id': seo.value.personId },
          }),
        ]
      : []),
  ])

  return seo
}
