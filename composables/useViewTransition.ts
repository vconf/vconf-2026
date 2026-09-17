import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * 用原生 View Transition 包住一次 DOM 更新。
 *
 * 形變本身沒有 VueUse 版本可用（`useTransition` 是數值補間，不是這個 API），
 * 所以核心是 `document.startViewTransition`；VueUse 負責它旁邊那件事 ——
 * `usePreferredReducedMotion` 讓偏好減少動態的人**完全不進入轉場**，
 * 連快照都不拍，比只用 CSS 把動畫關成 0s 更省。
 *
 * 要點：`update` 裡**不要有網路等待**。轉場期間整頁是凍結的靜態快照，
 * 把 fetch 或圖片載入放進去，畫面就會在那段時間完全不動。
 */
export function useViewTransition() {
  const reducedMotion = usePreferredReducedMotion()

  return async function transition(update: () => void | Promise<void>) {
    const unsupported
      = !import.meta.client || typeof document.startViewTransition !== 'function'

    if (unsupported || reducedMotion.value === 'reduce') {
      await update()

      return
    }

    /*
     * 標記這是照片的形變，讓 CSS 只在這種轉場關掉整頁的淡入淡出。
     * 照片正在展開、背景同時在淡，讀起來會像「換了一頁」而不是「這張照片放大了」。
     */
    const root = document.documentElement
    root.dataset.viewTransition = 'recap-photo'

    const vt = document.startViewTransition(async () => {
      await update()
      await nextTick()
    })

    // 被下一個轉場打斷是正常的，不要讓它變成未處理的 rejection
    vt.finished.catch(() => {}).finally(() => {
      delete root.dataset.viewTransition
    })
  }
}
