import type { Priority, Viewport } from '~/composables/useImagePreload'
import type { TeamMember, TeamPhotoKind } from '~/config/team'
import { teamPhoto } from '~/config/team'

/**
 * 籌備團隊彈窗的圖片 URL。
 *
 * 與 useSpeakerImages 同樣的用意：URL 用 useImage() 產生，跟 <NuxtImg> 走同一條 IPX 路徑，
 * 而 getImage() 在 prerender 時會把 URL 掛上 x-nitro-prerender，讓靜態圖檔在 build 就產出。
 */

/** 尺寸與 TeamMemberModal 的 <NuxtImg> 一致 */
const MODAL_PHOTOS: Array<{
  kind: TeamPhotoKind
  width: number
  height: number
}> = [
  { kind: 'popupMobile', width: 149, height: 149 },
  { kind: 'popup', width: 333, height: 506 },
]

const DENSITIES = [1, 2]

const MODAL_PHOTO_BY_VIEWPORT: Record<Viewport, {
  kind: TeamPhotoKind
  width: number
  height: number
}> = {
  mobile: MODAL_PHOTOS[0]!,
  desktop: MODAL_PHOTOS[1]!,
}

export function useTeamImages() {
  const img = useImage()
  const { currentTarget, preload } = useImagePreload()

  function toUrl(src: string, width: number, height: number) {
    return img(src, { format: 'avif,webp', width, height })
  }

  /** NuxtImg placeholder 產生的模糊小圖，URL 參數與元件內部一致 */
  function toPlaceholderUrl(src: string) {
    return img(src, {
      format: 'avif,webp',
      quality: 50,
      blur: 3,
      width: 10,
      height: 10,
    })
  }

  /**
   * prerender 時把彈窗會用到的圖註冊進靜態產出。
   *
   * 彈窗是 v-if="visible"、SSR 階段不渲染，裡面的 <NuxtImg> 不會執行，
   * 少了這一步這些圖不會進 build，使用者第一次開彈窗得等 runtime 即時轉檔。
   */
  function registerTeamModalImages(members: TeamMember[]) {
    for (const member of members) {
      for (const { kind, width, height } of MODAL_PHOTOS) {
        const src = teamPhoto(member, kind)

        // 尚未提供照片的成員（畫面上以名稱首字遞補）沒有圖可以產
        if (!src)
          continue

        toPlaceholderUrl(src)

        for (const density of DENSITIES)
          toUrl(src, width * density, height * density)
      }
    }
  }

  /** 只抓目前斷點真正會顯示的成員彈窗照，並等到解碼完成。 */
  function preloadTeamModal(
    member: TeamMember,
    priority: Priority = 'low',
  ) {
    const { viewport, density } = currentTarget()
    const { kind, width, height } = MODAL_PHOTO_BY_VIEWPORT[viewport]
    const src = teamPhoto(member, kind)

    if (!src)
      return Promise.resolve(true)

    return preload(
      toUrl(src, width * density, height * density),
      priority,
    )
  }

  return { registerTeamModalImages, preloadTeamModal }
}
