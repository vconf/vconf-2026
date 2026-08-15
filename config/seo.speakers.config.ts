/**
 * 講者／議程頁的 SEO 設定。
 *
 * 設計原則：預設值一律從 content/speakers/*.md 推導，
 * 只有需要客製的講者才寫進 speakerSeoOverrides，避免同一份文案存在兩處而漂移。
 */

export type SpeakerSeoType = 'agenda' | 'speakers'

export interface SpeakerSeoOverride {
  /** 覆寫頁面標題 */
  title?: string
  /** 覆寫頁面描述 */
  description?: string
  /** OG 圖路徑，放在 public/ogImage/ 底下；未設定則 fallback 到全站 og-image.png */
  ogImage?: string
  /** OG 圖替代文字，未設定則使用講者姓名 */
  ogImageAlt?: string
  /** OG 圖寬度（px），未設定則沿用全站 og-image 的尺寸 */
  ogImageWidth?: number
  /** OG 圖高度（px），未設定則沿用全站 og-image 的尺寸 */
  ogImageHeight?: number
}

/**
 * 個別講者覆寫，key 為 content 的 talkSlug（同時也是網址的 id）。
 * OG 圖需人工出圖後放進 public/ogImage/，此處填相對路徑。
 */
export const speakerSeoOverrides: Record<string, SpeakerSeoOverride> = {
  kuku: {
    ogImage: '/ogImage/og-img-kuku.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 680,
  },
  ray: {
    ogImage: '/ogImage/og-img-ray.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 680,
  },
}

export function getSpeakerSeoOverride(talkSlug: string): SpeakerSeoOverride {
  return speakerSeoOverrides[talkSlug] ?? {}
}
