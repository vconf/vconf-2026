import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

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

    // 切換頁面時先立即回到頂部
    nuxtApp.hook('page:start', () => {
      lenis.scrollTo(0, { immediate: true })
    })

    // 頁面完成後再同步一次滾動狀態並刷新 ScrollTrigger
    nuxtApp.hook('page:finish', () => {
      lenis.scrollTo(0, { immediate: true })
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
