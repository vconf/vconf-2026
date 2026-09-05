import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { isModalNavigation } from '~/utils/modalRoute'

export default defineNuxtPlugin({
  name: 'lenis',
  setup(nuxtApp) {
    // lerp 模式：每幀朝目標靠近固定比例，比 duration 模式跟手
    const BASE_LERP = 0.13 // 中間段：直接、順
    const EDGE_LERP = 0.06 // 頂/底：加大平滑做出緩速感
    const EDGE_ZONE = 350 // 距頂/底多少 px 內開始漸進阻尼

    const lenis = new Lenis({
      lerp: BASE_LERP,
    })

    // 依「距頂/底的距離」線性內插 lerp，邊緣阻尼漸進不跳變
    const updateEdgeDamping = () => {
      const distToEdge = Math.min(lenis.scroll, lenis.limit - lenis.scroll)
      const t = Math.min(1, Math.max(0, distToEdge / EDGE_ZONE))
      lenis.options.lerp = EDGE_LERP + (BASE_LERP - EDGE_LERP) * t
    }

    const onScroll = () => {
      updateEdgeDamping()
      ScrollTrigger.update()
    }
    const onTick = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', onScroll)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    // 開/關彈窗只更新同一個頁面的可選參數，不觸發 Lenis 回頂。
    // 底下兩個 hook 的回呼都拿不到 to/from，只能在導覽開始時先判斷並記下來。
    let skipScrollReset = false
    const pageScrollReady = usePageScrollReady()

    // 用 useRouter() 而非 nuxtApp.$router：後者的型別要靠 plugins.d.ts 反推本檔案的
    // provide，會形成循環而退化成 unknown。
    const router = useRouter()

    router.beforeEach((to, from) => {
      skipScrollReset = isModalNavigation(to.path, from.path)

      if (!skipScrollReset)
        pageScrollReady.value = false
    })

    router.afterEach((_to, _from, failure) => {
      if (failure)
        pageScrollReady.value = true
    })

    // 離場動畫結束後才回頂，讓舊頁面在原本的捲動位置淡出
    const resetScroll = () => {
      if (skipScrollReset)
        return

      lenis.scrollTo(0, { immediate: true })
      pageScrollReady.value = true
    }

    // 歸零只信這一個時機：page:transition:finish 就是 <NuxtPage> transition 的
    // onAfterLeave，舊頁面已離場、新頁面還沒掛載。
    // 不要退回 page:finish 補位——out-in 配 suspensible 時 Suspense 常在離場動畫
    // 還沒播完就 resolve，page:finish 會搶在離場前把捲軸拉到頂，正是原本的症狀。
    nuxtApp.hook('page:transition:finish', resetScroll)

    // 新頁面掛載後刷新 ScrollTrigger（此時捲軸已由上面的 hook 歸零）。
    // 開/關彈窗時整段跳過，保留同一個背景頁的捲動狀態。
    nuxtApp.hook('page:finish', () => {
      if (skipScrollReset)
        return

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    })

    nuxtApp.vueApp.onUnmount(() => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    })

    return {
      provide: {
        lenis,
      },
    }
  },
})
