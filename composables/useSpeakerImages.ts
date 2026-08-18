import type { SpeakersCollectionItem } from '@nuxt/content'
import { speakerPhoto } from '~/utils/agenda'

interface ImageSpec {
  src: string
  width: number
  height: number
}

type Viewport = 'mobile' | 'desktop'
type Density = 1 | 2
type Priority = 'high' | 'low'

const DESKTOP_MEDIA = '(min-width: 768px)'

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

const requested = new Set<string>()

/** SpeakerProfileModal 的講者照 */
function profileSpec(
  speaker: SpeakersCollectionItem,
  viewport: Viewport,
): ImageSpec {
  return viewport === 'mobile'
    ? { src: speakerPhoto(speaker, 'profileMobile'), width: 260, height: 370 }
    : { src: speakerPhoto(speaker, 'profile'), width: 333, height: 560 }
}

export function useSpeakerImages() {
  const img = useImage()

  function toUrl(spec: ImageSpec, density: Density) {
    return img(spec.src, {
      format: 'avif,webp',
      width: spec.width * density,
      height: spec.height * density,
    })
  }

  /** 目前裝置實際會用到的斷點與像素密度，只預載這一組 */
  function currentTarget(): { viewport: Viewport, density: Density } {
    return {
      viewport: window.matchMedia(DESKTOP_MEDIA).matches ? 'desktop' : 'mobile',
      density: window.devicePixelRatio > 1 ? 2 : 1,
    }
  }

  function request(url: string, priority: Priority) {
    if (!import.meta.client || requested.has(url))
      return

    requested.add(url)

    const image = new Image()
    // fetchpriority 要在 src 之前設定才會影響這次請求
    image.setAttribute('fetchpriority', priority)
    image.src = url
  }

  /**
   * prerender 時把彈窗會用到的圖註冊進靜態產出。
   */
  function registerModalImages(speakers: SpeakersCollectionItem[]) {
    for (const viewport of VIEWPORTS) {
      for (const density of DENSITIES) {
        toUrl(MODAL_BACKGROUNDS[viewport], density)

        for (const speaker of speakers)
          toUrl(profileSpec(speaker, viewport), density)
      }
    }
  }

  /** 預載彈窗背景（只抓目前斷點需要的那張） */
  function preloadModalBackground(priority: Priority = 'low') {
    const { viewport, density } = currentTarget()

    request(toUrl(MODAL_BACKGROUNDS[viewport], density), priority)
  }

  /** 預載單一講者的彈窗照片；游標碰到卡片時用 high */
  function preloadSpeakerModal(
    speaker: SpeakersCollectionItem,
    priority: Priority = 'low',
  ) {
    const { viewport, density } = currentTarget()

    request(toUrl(profileSpec(speaker, viewport), density), priority)
  }

  /** 首頁輪播的 SVG <image> 用；SVG 不吃 srcset，直接給 2x */
  function cardPhotoUrl(speaker: SpeakersCollectionItem) {
    return toUrl({ src: speaker.avatar, ...CARD_PHOTO_SIZE }, 2)
  }

  return {
    registerModalImages,
    preloadModalBackground,
    preloadSpeakerModal,
    cardPhotoUrl,
  }
}
