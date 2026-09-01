import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  // 刻意什麼都不做：捲動主導權完全交給 plugins/lenis.client.ts。
  // 移掉這個檔案會退回 Nuxt 內建的 scrollBehavior，它對「path 不同」的導覽一律捲到頂
  // （連開/關彈窗都會被捲），且用原生 scrollTo，與 Lenis 的內部位置不同步。
  scrollBehavior() {
    return false
  },
}
