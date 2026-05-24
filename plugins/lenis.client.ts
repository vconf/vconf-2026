import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export default defineNuxtPlugin({
  name: 'lenis',
  setup(nuxtApp) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    })

    const onScroll = () => ScrollTrigger.update()
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
