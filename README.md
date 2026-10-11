# v-conf Taiwan 2026

<a href="https://v-conf.vue.tw" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Website-v--conf.vue.tw-42b883" alt="Website">
</a>
<a href="https://www.facebook.com/groups/vuejs.tw" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Facebook-Vue.js_Taiwan-1877F2" alt="Facebook">
</a>
<a href="https://www.instagram.com/vuejs_taiwan" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Instagram-vuejs__taiwan-E4405F" alt="Instagram">
</a>
<a href="https://www.threads.com/@vuejs_taiwan" target="_blank" rel="noopener noreferrer">
  <img src="https://img.shields.io/badge/Threads-@vuejs__taiwan-black" alt="Threads">
</a>

v-conf Taiwan 是由 Vue.js Taiwan 社群舉辦的年度研討會，聚焦 Vue 生態系與現代前端開發體驗。議程涵蓋 Vue、Vite、工具鏈與實務案例等前端議題，邀請講者分享在真實專案中累積的經驗，也讓來自各地的開發者有機會面對面交流，一同探索 Web 開發的下一個階段。

2026 年的活動將於 **2026/10/17（六）** 在 **政大公企中心 A2 國際會議廳** 舉行。

- **官方網站**: <a href="https://v-conf.vue.tw" target="_blank" rel="noopener noreferrer">v-conf.vue.tw</a>
- **購票資訊**: <a href="https://www.accupass.com/event/2608061222041992146998" target="_blank" rel="noopener noreferrer">ACCUPASS</a>
- **聯絡信箱**: <a href="mailto:vuejs_taiwan@googlegroups.com" target="_blank" rel="noopener noreferrer">vuejs_taiwan@googlegroups.com</a>

---

## Tech Stack

### Core Frameworks

- <a href="https://nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt 3</a> & <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue 3</a>
- <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a>
- <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer">Tailwind v3</a>

### Nuxt Ecosystem & SEO

- <a href="https://content.nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt Content</a>
- <a href="https://nuxtseo.com/" target="_blank" rel="noopener noreferrer">Nuxt SEO</a>
- <a href="https://image.nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt Image</a>
- <a href="https://scripts.nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt Scripts</a>
- <a href="https://fonts.nuxt.com/" target="_blank" rel="noopener noreferrer">Nuxt Fonts</a>
- <a href="https://nuxt.com/modules/icon" target="_blank" rel="noopener noreferrer">Nuxt Icon</a>
- <a href="https://color-mode.nuxtjs.org/" target="_blank" rel="noopener noreferrer">Nuxt Color Mode</a>
- <a href="https://nuxt.com/modules/swiper" target="_blank" rel="noopener noreferrer">Nuxt Swiper</a>

### Animations & Interaction

- <a href="https://gsap.com/" target="_blank" rel="noopener noreferrer">GSAP</a>
- <a href="https://lenis.darkroom.engineering/" target="_blank" rel="noopener noreferrer">Lenis</a>
- <a href="https://vueuse.org/" target="_blank" rel="noopener noreferrer">VueUse</a>

### Analytics

- <a href="https://nuxt.com/modules/gtag" target="_blank" rel="noopener noreferrer">Google Analytics（nuxt-gtag）</a>
- <a href="https://umami.is/" target="_blank" rel="noopener noreferrer">Umami</a>
- <a href="https://developers.facebook.com/docs/meta-pixel" target="_blank" rel="noopener noreferrer">Meta Pixel</a>

### Engineering & Tools

- <a href="https://github.com/antfu/eslint-config" target="_blank" rel="noopener noreferrer">ESLint</a>
- <a href="https://commitizen-tools.github.io/commitizen/" target="_blank" rel="noopener noreferrer">Commitizen</a>
- <a href="https://typicode.github.io/husky/" target="_blank" rel="noopener noreferrer">Husky</a>
- <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">Vercel</a>

---

## Prerequisites

- Node.js `22.x`（與 Vercel 專案設定的版本一致）
- pnpm `>= v8.15.9`

---

## Project Structure

```
vconf-2026/
├── app/                 # Router 設定（捲動行為等）
├── assets/              # 靜態資源（CSS 等）
├── components/          # Vue 元件，依頁面分組
│   ├── home/           # 首頁
│   ├── about/          # 關於我們
│   ├── agenda/         # 議程
│   ├── speakers/       # 講者介紹
│   ├── sponsors/       # 贊助夥伴
│   ├── team/           # 籌備團隊
│   ├── recap/          # 活動花絮（尚未公開）
│   └── share/          # 跨頁共用元件
├── composables/         # Vue Composables
├── config/              # 配置檔案（SEO、預渲染、團隊、花絮等）
├── content/             # Nuxt Content 內容檔案
│   ├── speakers/       # 講者與議程（Markdown）
│   └── team/           # 籌備團隊成員（YAML）
├── layouts/             # 頁面佈局
├── lib/                 # 工具函式庫
├── pages/               # 頁面路由（檔案式路由）
├── plugins/             # Nuxt 插件（GSAP、Lenis 等）
├── public/              # 公開靜態檔案
├── server/              # 伺服器端程式碼與 API 路由
├── types/               # TypeScript 型別定義
├── utils/               # 共用工具函式
├── content.config.ts    # Nuxt Content Collection 定義
├── eslint.config.js     # ESLint 配置
├── nuxt.config.ts       # Nuxt 配置檔案
├── package.json         # 專案相依套件
├── tailwind.config.js   # Tailwind CSS 配置
├── tsconfig.json        # TypeScript 配置
└── vercel.json          # Vercel 轉址設定
```

新增講者或籌備團隊成員時，只需要在 `content/speakers/` 或 `content/team/` 新增一個檔案，預渲染路由與 Sitemap 會在建置時自動產生。

---

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

開發伺服器將啟動於 `http://localhost:3000`

### Available Scripts

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Commit with Commitizen
pnpm commit

# Update CHANGELOG.md
pnpm changelog
```

---

## Production

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

正式環境部署於 <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">Vercel</a>。

---

## Code Style

本專案使用以下工具維護程式碼品質：

- <a href="https://github.com/antfu/eslint-config" target="_blank" rel="noopener noreferrer">@antfu/eslint-config</a> - ESLint 配置
- <a href="https://github.com/francoismassart/eslint-plugin-tailwindcss" target="_blank" rel="noopener noreferrer">eslint-plugin-tailwindcss</a> - Tailwind CSS linting
- <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer">Prettier</a> - 程式碼格式化
- <a href="https://commitizen-tools.github.io/commitizen/" target="_blank" rel="noopener noreferrer">Commitizen</a> - 規範化 commit 訊息
- <a href="https://commitlint.js.org/" target="_blank" rel="noopener noreferrer">commitlint</a> - 檢查 commit 訊息是否符合 Conventional Commits
- <a href="https://typicode.github.io/husky/" target="_blank" rel="noopener noreferrer">Husky</a> - Git hooks
- <a href="https://github.com/lint-staged/lint-staged" target="_blank" rel="noopener noreferrer">Lint-staged</a> - Pre-commit linting

詳細配置請參考 <a href="eslint.config.js" target="_blank" rel="noopener noreferrer">eslint.config.js</a>

---

## Team

### 總召組

- **Alex Liu**（總召） - <a href="https://mini-ghost.dev/" target="_blank" rel="noopener noreferrer">Website</a>
- **安安** - <a href="https://ilyal.me/" target="_blank" rel="noopener noreferrer">Website</a> / <a href="https://x.com/ilyaliao" target="_blank" rel="noopener noreferrer">X</a> / <a href="https://www.threads.com/@ilya.liao" target="_blank" rel="noopener noreferrer">Threads</a>
- **Mike** - <a href="https://thecodingpro.com/" target="_blank" rel="noopener noreferrer">Website</a> / <a href="https://www.facebook.com/cheng.zhi.yuan.33285/" target="_blank" rel="noopener noreferrer">Facebook</a> / <a href="https://www.instagram.com/mike_cheng1208/" target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://www.threads.com/@mike_cheng1208" target="_blank" rel="noopener noreferrer">Threads</a>
- **Noah** - <a href="https://noahchen.me/" target="_blank" rel="noopener noreferrer">Website</a>

### 議程組

- **安安**（組長）
- **Sova Yu**
- **美男**
- **Rafael**
- **Benny**

### 行銷組

- **Hannah**（組長）
- **z**
- **七倫**
- **墨同學**

### 贊助組

- **Mike**（組長）

### 場務組

- **Noah**（組長）
- **Wujue** - <a href="https://blog.wujue.dev/" target="_blank" rel="noopener noreferrer">Blog</a> / <a href="https://x.com/wujue0115" target="_blank" rel="noopener noreferrer">X</a> / <a href="https://www.threads.com/@wujue0115" target="_blank" rel="noopener noreferrer">Threads</a>

### 開發組

- **Antonio**（組長） - <a href="https://www.facebook.com/ling.jun.hao.839468/" target="_blank" rel="noopener noreferrer">Facebook</a> / <a href="https://www.instagram.com/qd513020/" target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://ithelp.ithome.com.tw/users/20116554" target="_blank" rel="noopener noreferrer">iThome</a>

---

## License

Copyright © 2026 Vue.js Taiwan. All rights reserved.
