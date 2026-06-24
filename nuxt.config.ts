import { site, sitemap } from './config/seo.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@tresjs/nuxt',
    'nuxt-swiper',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxtjs/color-mode',
    'nuxt-gtag',
  ],

  css: ['@/assets/css/main.css'],

  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },

  runtimeConfig: {
    public: {
      umamiScriptUrl: process.env.NUXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js',
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '',
    },
  },

  colorMode: {
    classSuffix: '',
  },

  fonts: {
    families: [
      {
        name: 'Afacad',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal'],
        display: 'swap',
      },
      {
        name: 'Noto Sans TC',
        provider: 'google',
        weights: [400, 500, 700],
        styles: ['normal'],
        display: 'swap',
      },
    ],
  },

  // 全域設定
  // 頁面切換動畫採用舊動畫先移除之後，再進來新動畫
  app: {
    head: {
      meta: [
        { name: 'color-scheme', content: 'light dark' },
      ],
      link: [
        {
          rel: 'icon',
          href: 'https://v-conf.vue.tw/favicon.png', // 絕對路徑，網站圖示
        },
        {
          rel: 'apple-touch-icon',
          href: 'https://v-conf.vue.tw/app-touch-icon.png', // 絕對路徑，Apple 設備加入主畫面的圖片
        },
        {
          rel: 'stylesheet',
          href: 'https://use.typekit.net/zyp0lum.css', // Adobe Fonts 的 CSS 連結
        },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
  },

  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },

  build: {
    transpile: ['gsap'],
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'lottie': ['lottie-web'],
            'lenis': ['lenis'],
            'vue-vendor': ['vue', 'vue-router'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      ...(process.env.NODE_ENV === 'production' && {
        cssnano: {
          preset: 'default',
        },
      }),
    },
  },

  sitemap,
  site,
})
