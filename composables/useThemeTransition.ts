import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

type Theme = 'light' | 'dark'

// color-mode 是在 watcher 裡改 <html> 的 class，換完之前拍快照就會拍到舊主題。
// 不能用 requestAnimationFrame 等：轉場的 update 期間渲染是暫停的，rAF 不會觸發，轉場會卡到逾時被略過
async function waitForThemeClass(theme: Theme) {
  for (
    let i = 0;
    i < 10 && !document.documentElement.classList.contains(theme);
    i++
  ) {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

/**
 * 深淺色切換：舊主題切成八片斜角卡片，由左往右接力退場，露出底下的新主題。
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

    const vt = document.startViewTransition(async () => {
      colorMode.preference = theme
      await waitForThemeClass(theme)
    })

    vt.finished
      .catch(() => {})
      .finally(() => {
        delete root.dataset.viewTransition
      })
  }
}
