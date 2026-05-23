import { ogImage, site } from './config/seo.config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@tresjs/nuxt',
    'nuxt-typed-router',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/scripts',
    'nuxt-typed-router',
    '@nuxtjs/color-mode',
  ],
  css: ['@/assets/css/main.css'],

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
          href: 'https://webconf.tw/favicon.ico', // 絕對路徑，網站圖示
          sizes: 'any',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png', // 絕對路徑，Apple 設備加入主畫面的圖片
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

  site,
  ogImage,
})
