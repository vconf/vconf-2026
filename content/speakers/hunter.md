---
speakerId: hunter
name: Hunter Liu
slug: hunter
company: Colorful Casting
jobTitle: Tech Lead
avatar: /speaker/hunterLiu-profile-desktop.png
profileAvatar: /speaker/hunterLiu-profile-desktop.png
avatarAlt: Hunter Liu 頭像
speakerInfo: 現任日本新創 Colorful Casting 的 Tech Lead，擁有 9 年軟體開發經驗，專注於 Vue、Vite、TypeScript、Nuxt 與產品架構。除了前端，也具備後端與資料庫開發經驗，參與過非關聯式及關聯式資料庫系統的設計與建置。工作涵蓋架構設計、程式碼審查、自動化測試、CI/CD，以及 Web、iOS、Android 跨平台產品開發，重視可維護性、開發體驗與團隊協作。
experiences:
  - 曾任 Vue.js Taiwan 管理員，並長期參與 Vue.tw 社群工作。開發並維護 Vue 開源元件 vue-final-modal。
  - 曾擔任 Laravel x Vue Conf 2021、MOPCON 2019 / 2020 及 Vue.js Taiwan 社群講者，分享主題涵蓋 Vue 3 Composable、Modal 元件設計與 Nuxt 等。
  - 亦曾撰寫 Vue.js 與 Nuxt.js 系列技術文章，並舉辦線上及線下前端技術交流活動。
links:
  - label: FB
    href: https://www.facebook.com/hunterliu1003
    text: facebook.com/hunterliu1003
  - label: IG
    href: https://www.instagram.com/hunterliu1003/
    text: instagram.com/hunterliu1003
  - label: X
    href: https://x.com/hunterliu1003
    text: x.com/hunterliu1003
  - label: thread
    href: https://www.threads.com/@hunterliu1003
    text: threads.com/@hunterliu1003
  - label: 個人網站
    href: https://hunterliu.tw/
    text: hunterliu.tw/
  - label: 希望宣傳連結
    href: https://github.com/hunterliu1003
    text: github.com/hunterliu1003
talkNumber: 2
talkSlug: hunter
topic: "套件打包實戰：以 tsdown 重新打包 vue-final-modal"
startTime: "10:25"
endTime: "11:10"
---

發佈一個 Vue 元件庫，麻煩的從來不是寫元件，而是打包：SFC 要編譯、型別宣告要正確、CSS 要輸出、CJS / ESM 都要能用，相依套件該外部化還是打包進去。設定越堆越多，打包工具本身就變成技術債。

tsdown 是由 Rolldown 官方維護的函式庫打包工具，從 TypeScript 函式庫到 Vue 元件庫都提供最佳的開發體驗。它底層以 Rust 驅動、建置速度極快，優雅地解決了幾乎所有打包痛點，設定檔通常只需要幾行；既有的 Rollup、unplugin 與部分 Vite Plugins 也能繼續沿用，未來更將成為下一代 Vite 函式庫模式的基礎。

後半段將以我維護的 vue-final-modal v5 為實戰案例，分享改用 tsdown 的過程：.vue 編譯、型別宣告、CSS 產出、三種輸出格式與 peer dependency 的實際取捨，以及遷移過程中學到的經驗。
