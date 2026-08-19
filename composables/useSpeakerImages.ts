import type {
  Density,
  ImageSpec,
  Priority,
  Viewport,
} from '~/composables/useImagePreload'
import type { AnySpeaker } from '~/utils/agenda'
import { speakerPhoto } from '~/utils/agenda'

const MODAL_BACKGROUNDS: Record<Viewport, ImageSpec> = {
  mobile: {
    src: '/speaker/speaker-modal-bg-mobile.png',
    width: 402,
    height: 504,
  },
  desktop: {
    src: '/speaker/speaker-modal-bg-desktop.png',
    width: 788,
    height: 483,
  },
}

const CARD_PHOTO_SIZE = { width: 306, height: 433 } as const

const VIEWPORTS: Viewport[] = ['mobile', 'desktop']
const DENSITIES: Density[] = [1, 2]

/** SpeakerProfileModal 的講者照 */
function profileSpec(
  speaker: AnySpeaker,
  viewport: Viewport,
): ImageSpec {
  return viewport === 'mobile'
    ? { src: speakerPhoto(speaker, 'profileMobile'), width: 260, height: 370 }
    : { src: speakerPhoto(speaker, 'profile'), width: 333, height: 560 }
}

/** AgendaTalkModal 的講者照 */
function agendaSpec(speaker: AnySpeaker, viewport: Viewport): ImageSpec {
  return viewport === 'mobile'
    ? { src: speakerPhoto(speaker, 'modalMobile'), width: 120, height: 120 }
    : { src: speakerPhoto(speaker, 'modal'), width: 253, height: 400 }
}

export function useSpeakerImages() {
  const img = useImage()
  const { currentTarget, preload } = useImagePreload()

  function toUrl(spec: ImageSpec, density: Density) {
    return img(spec.src, {
      format: 'avif,webp',
      width: spec.width * density,
      height: spec.height * density,
    })
  }

  /** NuxtImg placeholder 產生的模糊小圖，URL 參數與元件內部一致 */
  function toPlaceholderUrl(spec: ImageSpec) {
    return img(spec.src, {
      format: 'avif,webp',
      quality: 50,
      blur: 3,
      width: 10,
      height: 10,
    })
  }

  /**
   * prerender 時把彈窗會用到的圖註冊進靜態產出。
   */
  function registerModalImages(speakers: AnySpeaker[]) {
    for (const viewport of VIEWPORTS) {
      toPlaceholderUrl(MODAL_BACKGROUNDS[viewport])

      for (const density of DENSITIES) {
        toUrl(MODAL_BACKGROUNDS[viewport], density)

        for (const speaker of speakers) {
          toPlaceholderUrl(profileSpec(speaker, viewport))
          toUrl(profileSpec(speaker, viewport), density)
        }
      }
    }
  }

  /** 預載彈窗背景（只抓目前斷點需要的那張） */
  function preloadModalBackground(priority: Priority = 'low') {
    const { viewport, density } = currentTarget()

    return preload(toUrl(MODAL_BACKGROUNDS[viewport], density), priority)
  }

  /** 預載單一講者的彈窗照片；游標碰到卡片時用 high */
  function preloadSpeakerModal(
    speaker: AnySpeaker,
    priority: Priority = 'low',
  ) {
    const { viewport, density } = currentTarget()

    return preload(toUrl(profileSpec(speaker, viewport), density), priority)
  }

  /** 同 registerModalImages，對象換成議程彈窗 */
  function registerAgendaModalImages(speakers: AnySpeaker[]) {
    for (const viewport of VIEWPORTS) {
      for (const density of DENSITIES) {
        for (const speaker of speakers) {
          toPlaceholderUrl(agendaSpec(speaker, viewport))
          toUrl(agendaSpec(speaker, viewport), density)
        }
      }
    }
  }

  /** 預載議程彈窗的講者照；游標碰到議程卡片時用 high */
  function preloadAgendaTalk(speaker: AnySpeaker, priority: Priority = 'low') {
    const { viewport, density } = currentTarget()

    return preload(toUrl(agendaSpec(speaker, viewport), density), priority)
  }

  /** 首頁輪播的 SVG <image> 用；SVG 不吃 srcset，直接給 2x */
  function cardPhotoUrl(speaker: AnySpeaker) {
    return toUrl({ src: speaker.avatar, ...CARD_PHOTO_SIZE }, 2)
  }

  return {
    registerModalImages,
    registerAgendaModalImages,
    preloadAgendaTalk,
    preloadModalBackground,
    preloadSpeakerModal,
    cardPhotoUrl,
  }
}
