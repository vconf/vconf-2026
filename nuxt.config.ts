import type { FontFaceData } from '@nuxt/fonts'
import type { Config as SvgoConfig } from 'svgo'
import { Buffer } from 'node:buffer'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { optimize } from 'svgo'
import { site, sitemap } from './config/seo.config'

const svgoConfig: SvgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // SVG 若有動畫、CSS 或 JS 依賴 id，就保留
          cleanupIds: false,
        },
      },
    },
    'sortAttrs',
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            xmlns: 'http://www.w3.org/2000/svg',
          },
        ],
      },
    },
  ],
}

interface FontResolveResult {
  fonts: FontFaceData[]
  fallbacks?: string[]
}

interface ResolvedFontProvider {
  resolveFont?: (..._args: unknown[]) => FontResolveResult | undefined | Promise<FontResolveResult | undefined>
}

interface FontProviderInitializer {
  (..._args: unknown[]): ResolvedFontProvider | undefined | Promise<ResolvedFontProvider | undefined>
  _name?: string
  _options?: unknown
}

interface FontProviderFactory {
  (_options?: unknown): FontProviderInitializer
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
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
    adobe: {
      id: 'zyp0lum',
    },
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
      {
        name: 'Avenir Next LT Pro',
        provider: 'adobe',
        weights: [700, 900],
        styles: ['normal'],
      },
    ],
  },

  hooks: {
    'fonts:providers': (providers) => {
      const adobeProvider = providers.adobe as FontProviderFactory

      providers.adobe = ((options?: unknown) => {
        const provider = adobeProvider(options)

        return Object.assign(
          async (...args: unknown[]) => {
            const resolvedProvider = await provider(...args)

            if (!resolvedProvider)
              return resolvedProvider

            return {
              ...resolvedProvider,
              async resolveFont(...resolveArgs: unknown[]) {
                const result = await resolvedProvider.resolveFont?.(...resolveArgs)

                if (!result)
                  return result

                return {
                  ...result,
                  fonts: result.fonts.map((font: FontFaceData) => ({
                    ...font,
                    display: 'swap',
                  })),
                }
              },
            }
          },
          {
            _name: provider._name,
            _options: provider._options,
          },
        )
      }) as typeof providers.adobe
    },

    // public/ 不經過 Vite，改在 Nitro 複製完資產後用 svgo 壓縮 .output/public 的 SVG（原始檔不動）
    'nitro:build:public-assets': async (nitro) => {
      const publicDir = nitro.options.output.publicDir
      const files = await readdir(publicDir, { recursive: true })
      const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'))

      let totalBefore = 0
      let totalAfter = 0
      await Promise.all(svgFiles.map(async (file) => {
        const filePath = join(publicDir, file)
        const source = await readFile(filePath, 'utf8')
        try {
          const { data } = optimize(source, { ...svgoConfig, path: filePath })
          totalBefore += Buffer.byteLength(source)
          totalAfter += Buffer.byteLength(data)
          if (data.length < source.length)
            await writeFile(filePath, data)
        }
        catch (error) {
          nitro.logger.warn(`[svg-optimizer] 略過 ${file}：`, error)
        }
      }))

      if (svgFiles.length > 0) {
        const saved = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
        nitro.logger.success(`[svg-optimizer] 已壓縮 ${svgFiles.length} 個 SVG：${(totalBefore / 1024).toFixed(1)} kB → ${(totalAfter / 1024).toFixed(1)} kB（省 ${saved}%）`)
      }
    },
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
