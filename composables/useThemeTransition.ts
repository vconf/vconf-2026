import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

type Theme = 'light' | 'dark'

// 光束只在轉場的「新」快照裡存在：切換前掛上、轉場結束就拿掉，平常的 DOM 看不到它
const BEAMS = ['left', 'right'] as const

function createBeam(side: typeof BEAMS[number]) {
  const el = document.createElement('div')
  el.setAttribute('aria-hidden', 'true')
  el.className = 'theme-beam'
  el.style.viewTransitionName = `theme-beam-${side}`
  return el
}

// color-mode 是在 watcher 裡改 <html> 的 class，換完之前拍快照就會拍到舊主題。
// 不能用 requestAnimationFrame 等：轉場的 update 期間渲染是暫停的，rAF 不會觸發，轉場會卡到逾時被略過
async function waitForThemeClass(theme: Theme) {
  for (let i = 0; i < 10 && !document.documentElement.classList.contains(theme); i++) {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

/**
 * 深淺色切換：新主題從畫面中線往左右翻開，兩道光束貼著開口的邊緣往外走。
 * 動畫全在 main.css 的 `data-view-transition="theme"` 區塊；只在 md 以上跑，手機、偏好減少動態或不支援時直接切換。
 */
export function useThemeTransition() {
  const colorMode = useColorMode()
  const reducedMotion = usePreferredReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return function setTheme(theme: Theme) {
    if (colorMode.value === theme)
      return

    const unsupported
      = !import.meta.client || typeof document.startViewTransition !== 'function'
    if (unsupported || reducedMotion.value === 'reduce' || !isDesktop.value) {
      colorMode.preference = theme
      return
    }

    const root = document.documentElement
    root.dataset.viewTransition = 'theme'
    const beams = BEAMS.map(createBeam)

    const vt = document.startViewTransition(async () => {
      colorMode.preference = theme
      document.body.append(...beams)
      await waitForThemeClass(theme)
    })

    vt.finished.catch(() => {}).finally(() => {
      beams.forEach(beam => beam.remove())
      delete root.dataset.viewTransition
    })
  }
}
