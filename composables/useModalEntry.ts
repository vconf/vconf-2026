import type { Ref } from 'vue'

/**
 * 從別頁直接進到彈窗網址（例如首頁輪播 → /agenda/x）時，彈窗跟著頁面同一幀出現、不淡入也不等圖，
 * 背景頁才不會先露出來閃一下；照片由 ShareFadeImage 的底色框接手。頁內開啟照舊等圖再淡入。
 */
export function useModalEntry(hasTarget: () => boolean) {
  const nuxtApp = useNuxtApp()
  // 首次載入的頁面是 SSR 畫好的，背景頁本來就在，只處理站內換頁
  let crossPage = import.meta.client && !nuxtApp.isHydrating && hasTarget()
  const instant = ref(false)

  /** 等彈窗備妥；回傳是否該跳過淡入 */
  async function ready(load: Promise<unknown>) {
    if (crossPage) {
      crossPage = false

      return true
    }

    await load

    return false
  }

  function show(visible: Ref<boolean>, skipFade: boolean) {
    instant.value = skipFade
    visible.value = true
    // 只有這次進場不淡入，之後的關閉與換開都照常
    void nextTick(() => {
      instant.value = false
    })
  }

  return { instant, ready, show }
}
