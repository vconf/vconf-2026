/* eslint-disable no-console -- Console 輸出就是這個彩蛋的介面本身 */
import { usePreferredReducedMotion } from '@vueuse/core'
import {
  easterEggAccepted,
  easterEggBanner,
  easterEggColors,
  easterEggFlag,
  easterEggRejected,
  easterEggTitle,
  easterEggTrigger,
} from '~/config/easterEgg.config'

declare global {
  interface Window {
    /** 提交入口；參加者在 Console 手動呼叫，所以參數當成不可信的輸入處理 */
    // eslint-disable-next-line no-unused-vars -- 型別宣告裡的參數名稱只是文件用途
    submitFlag: (flag: unknown) => void
    /** 通關後才掛上；解開之前刻意不存在，才不能靠自動補完跳過三關 */
    [easterEggTrigger]?: () => void
  }
}

const TITLE_STYLE = `font-size: 18px; font-weight: bold; color: ${easterEggColors[0]}`
const BANNER_STYLE = `font-size: 13px; color: ${easterEggColors[0]}`
const BODY_STYLE = `font-size: 13px; color: ${easterEggColors[1]}`

function svgDataUrl(viewBox: string, path: string, color: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${path}" fill="${color}"/></svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const VUE_ICON = svgDataUrl(
  '0 0 21 20',
  'M.014 12.929 0 5.036c0-.188.07-.357.158-.417.112-.082.409-.219.581-.096l5.48 3.915c.567.402 1.255.215 1.59-.376L12.228.298A.57.57 0 0 1 12.74 0h7.149c.214 0 .372.114.441.215.093.142.158.348.042.554L9.868 19.173c-.149.321-.516.445-.809.234L.014 12.929Z',
  easterEggColors[0],
)
const VITE_ICON = svgDataUrl(
  '0 0 16 15',
  'M8.545 14.86c-.221.28-.668.123-.668-.23v-3.407a.75.75 0 0 0-.75-.749h-3.76c-.302 0-.48-.345-.302-.592L5.54 6.421a.749.749 0 0 0-.609-1.184H.375c-.303 0-.481-.345-.303-.592L3.278.158A.374.374 0 0 1 3.581 0h9.554c.302 0 .481.345.302.592l-2.473 3.461a.749.749 0 0 0 .608 1.184h3.76c.31 0 .485.358.294.605l-7.08 9.017Z',
  easterEggColors[1],
)
/**
 * 標題框用 CSS border，不用 ╔══╗ 字元畫框。
 */
const TITLE_BOX_STYLE = [
  `color: ${easterEggColors[0]}`,
  `border: 2px solid ${easterEggColors[0]}`,
  'border-radius: 8px',
  'font-size: 15px',
  'font-weight: bold',
  'letter-spacing: 3px',
  // 左右留出 44px 給圖示：圖示距框線 14px、距文字 14px，兩側都不會貼邊
  'padding: 10px 44px',
  `background-image: url(${VUE_ICON}), url(${VITE_ICON})`,
  // 相對 padding box 定位，所以要自己內縮，否則會緊貼在 border 內側
  'background-position: 14px center, right 14px center',
  'background-size: 16px 16px',
  'background-repeat: no-repeat',
].join('; ')

/** Vue 與 Vite SVG 只夾在入口標題左右，維持 Console 畫面的單一視覺焦點。 */
function logBanner() {
  console.log(`%c${easterEggTitle}`, TITLE_BOX_STYLE)
  console.log(`%c${easterEggBanner.trim()}`, BANNER_STYLE)
}

/** 煙火總長與每發間隔（ms） */
const SHOW_DURATION = 2600
const BURST_INTERVAL = 220

/**
 * canvas-confetti 只在煙火真的被觸發時才載入，首屏成本是零。
 * 絕大多數訪客不會走到這裡，沒有理由讓他們先付這幾 KB。
 */
async function fireworks() {
  const { default: confetti } = await import('canvas-confetti')
  const endAt = performance.now() + SHOW_DURATION

  const burst = () => {
    if (performance.now() > endAt)
      return

    void confetti({
      particleCount: 60,
      startVelocity: 28,
      spread: 360,
      ticks: 70,
      // 每發從畫面上半部的隨機位置炸開，才有連放煙火的感覺
      origin: { x: Math.random(), y: Math.random() * 0.6 },
      colors: [...easterEggColors],
      disableForReducedMotion: true,
    })

    setTimeout(burst, BURST_INTERVAL)
  }

  burst()
}

export default defineNuxtPlugin({
  name: 'easter-egg',
  setup() {
    const reducedMotion = usePreferredReducedMotion()

    // 進站就先印。Chrome 會保留開啟 DevTools 之前的訊息，
    // 所以參加者按下 F12 的時候，這段已經在 Console 裡等他了。
    logBanner()

    window.submitFlag = (flag) => {
      // 大小寫與前後空白都放過；別讓貼上的格式差異卡住一個三分鐘的彩蛋
      const answer = typeof flag === 'string' ? flag.trim().toUpperCase() : ''

      if (answer !== easterEggFlag) {
        console.log(`%c${easterEggRejected}`, BODY_STYLE)

        return
      }

      console.log(`%c${easterEggAccepted}`, BANNER_STYLE)

      // 通關才掛上觸發函式；重複提交不會有副作用
      window[easterEggTrigger] = () => {
        if (reducedMotion.value === 'reduce') {
          console.log(
            '%c🎉 Welcome to Vconf 2026!（偵測到你偏好減少動態，已跳過煙火）',
            TITLE_STYLE,
          )

          return
        }

        console.log('%c🎉 Welcome to Vconf 2026!', TITLE_STYLE)
        void fireworks()
      }
    }

    onNuxtReady(() => {
      void $fetch('/api/vconf/status')
    })
  },
})
