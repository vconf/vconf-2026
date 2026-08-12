import type { SpeakersCollectionItem } from '@nuxt/content'
import type { SpeakerSeoType } from '~/config/seo.speakers.config'
import type { SpeakerSeoOptions } from '~/utils/seo'

type SpeakerSeoInput = SpeakersCollectionItem | null | undefined

export interface UseSpeakerSeoOptions {
  type: SpeakerSeoType
  /** 未指定則使用當前路由 path */
  path?: MaybeRefOrGetter<string | undefined>
  /** 沒有講者資料時的文案 */
  fallback?: SpeakerSeoOptions['fallback']
  robots?: string
}

/**
 * 把 buildSpeakerSeo() 的結果套用到 useSeoMeta 與 useSchemaOrg。
 * 傳入的講者可以是 ref／getter；meta 會隨網址切換更新，schema 由 SSR 輸出初始值。
 */
export function useSpeakerSeo(
  speaker: MaybeRefOrGetter<SpeakerSeoInput>,
  options: UseSpeakerSeoOptions,
) {
  const route = useRoute()

  const seo = computed(() =>
    buildSpeakerSeo(toValue(speaker), {
      type: options.type,
      path: toValue(options.path) ?? route.path,
      fallback: options.fallback,
    }),
  )

  useSeoMeta({
    title: () => seo.value.meta.title,
    description: () => seo.value.meta.description,
    ogTitle: () => seo.value.meta.title,
    ogDescription: () => seo.value.meta.description,
    ogUrl: () => seo.value.meta.ogUrl,
    ogImage: () => seo.value.meta.ogImage,
    ogImageAlt: () => seo.value.meta.ogImageAlt,
    ogImageWidth: () => seo.value.meta.ogImageWidth,
    ogImageHeight: () => seo.value.meta.ogImageHeight,
    ogImageType: () => (seo.value.meta.ogImage.endsWith('.jpg') ? 'image/jpeg' : 'image/png'),
    twitterCard: 'summary_large_image',
    twitterImage: () => seo.value.meta.ogImage,
    twitterImageAlt: () => seo.value.meta.ogImageAlt,
    robots: options.robots,
  })

  useSchemaOrg(seo.value.schema)

  return seo
}
