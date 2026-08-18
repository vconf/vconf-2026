import type { ImageSpec, Priority, Viewport } from '~/composables/useImagePreload'

/**
 * ShareHero 的裝飾背景，about / sponsors / speakers / agenda / team 五個頁面共用。
 *
 * 首頁用的是 HomeHero、載不到這幾張，所以離開首頁時一定是冷的；
 * 趁首頁閒置先抓回來，換頁時就不必等下載。尺寸與 ShareHero 的 <NuxtImg> 一致。
 */
const HERO_BACKGROUNDS: Record<Viewport, ImageSpec[]> = {
  mobile: [
    { src: '/about/hero-bg-left-small.png', width: 810, height: 817 },
    { src: '/about/hero-bg-right-small.png', width: 807, height: 818 },
  ],
  desktop: [
    { src: '/about/hero-bg-1.png', width: 1159, height: 1171 },
    { src: '/about/hero-bg-2.png', width: 1159, height: 1175 },
  ],
}

export function useShareHeroImages() {
  const img = useImage()
  const { currentTarget, preload } = useImagePreload()

  /** 預載共用 banner 的背景；只抓目前斷點與像素密度需要的那兩張 */
  function preloadShareHero(priority: Priority = 'low') {
    const { viewport, density } = currentTarget()

    for (const spec of HERO_BACKGROUNDS[viewport]) {
      const url = img(spec.src, {
        format: 'avif,webp',
        width: spec.width * density,
        height: spec.height * density,
      })

      preload(url, priority)
    }
  }

  return { preloadShareHero }
}
