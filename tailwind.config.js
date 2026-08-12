/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,jsx,ts,tsx,vue}',
    './app.vue',
    './pages/**/*.{js,ts,vue}',
    './config/**/*.{js,ts}',
    './.storybook/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '375px',
        xs: '480px',
      },
      aspectRatio: {
        'speaker-card': '267 / 374',
        'speaker-photo': '306 / 366',
        'speaker-photo-sm': '169 / 311',
        'speaker-photo-modal': '333 / 560',
        'speaker-photo-modal-sm': '260 / 370',
      },
      container: {
        center: true,
        screens: {
          '2xl': '1512px',
        },
      },
      fontFamily: {
        serif: ['"Noto Sans TC"', 'serif'],
        sans: ['"Avenir Next LT Pro"', 'sans-serif'],
        avenir: ['"Avenir"', 'serif'],
      },
      fontWeight: {
        'demi-light': '350',
      },
      fontSize: {
        12: ['12px', { lineHeight: '1.6', letterSpacing: '0.02em' }], // 2
        14: ['14px', { lineHeight: '1', letterSpacing: '0.02em' }], // 10；行高 1(×5) / 1.6(×3) 分歧，取多數
        16: ['16px', { lineHeight: '1.6', letterSpacing: '0.02em' }], // 39
        17: ['17px', { lineHeight: '1', letterSpacing: '0.02em' }], // 12
        18: ['18px', { lineHeight: '1', letterSpacing: '0.02em' }], // 14
        20: ['20px', { lineHeight: '1.2', letterSpacing: '0em' }], // 7
        21: ['21px', { lineHeight: '1.6', letterSpacing: '0.02em' }], // 12
        24: ['24px', { lineHeight: '1.2', letterSpacing: '0em' }], // 20
        32: ['32px', { lineHeight: '1', letterSpacing: '0em' }], // 14；字距 0em / 0.01em 各半，取較中性者
        48: ['48px', { lineHeight: '1', letterSpacing: '0em' }], // 4
      },
      width: {
        scrollbar: '12px',
      },
      clipPath: {
        mypolygon: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 1rem))',
        fancycut: 'polygon(32px 0%, 100% 0%, 100% 100%, 0% 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        sponsor: {
          104: '#FF7800',
        },
        vconf: {
          'heading': 'hsl(var(--color-heading))',
          'text-muted': 'hsl(var(--text-muted))',
          'text-unread': 'hsl(var(--color-text-unread))',
          'text-read': 'hsl(var(--color-text-read))',
          'black': 'hsl(var(--color-black))',
          'white': 'hsl(var(--background))',
          'primary': 'hsl(var(--color-primary))',
          'primary-light': 'hsl(var(--color-primary-light))',
          'purple': 'hsl(var(--color-purple))',
          'purple-ultralight': 'hsl(var(--color-purple-ultralight))',
          'sun': 'hsl(var(--color-sun))',
          'sun-background': 'hsl(var(--color-sun-background))',
          'moon': 'hsl(var(--color-moon))',
          'moon-background': 'hsl(var(--color-moon-background))',
          'moon-border': 'hsl(var(--color-moon-border))',
          'theme-toggle-bg': 'hsl(var(--color-theme-toggle-bg))',
          'gray-light': 'hsl(var(--color-gray-light))',
          'section-bg': 'hsl(var(--color-section-bg))',
          'gray-exlight': 'hsl(var(--color-gray-exlight))',
          'gray-ultralight': 'hsl(var(--color-gray-ultralight))',
          'scrollbar': '#DBDBDB',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({
      nocompatible: true,
      preferredStrategy: 'pseudoelements',
    }),
    require('tailwind-clip-path'),
    require('tailwindcss-animate'),
  ],
}
