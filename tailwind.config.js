/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,jsx,ts,tsx,vue}',
    './app.vue',
    './pages/**/*.{js,ts,vue}',
    './.storybook/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      screens: {
        xxs: '375px',
        xs: '480px',
      },
      container: {
        center: true,
        screens: {
          '2xl': '1512px',
        },
      },
      fontFamily: {
        serif: ['"Noto Sans TC"', 'serif'],
        sans: ['"avenir-next-lt-pro"', '"Noto Sans TC"', 'sans-serif'],
        avenir: ['"Avenir"', 'serif'],
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
        vconf: {
          'heading': 'hsl(var(--color-heading))',
          'text-muted': 'hsl(var(--text-muted))',
          'text-unread': 'hsl(var(--color-text-unread))',
          'text-read': 'hsl(var(--color-text-read))',
          'black': 'hsl(var(--color-black))',
          'white': 'hsl(var(--background))',
          'primary': 'hsl(var(--color-primary))',
          'purple': 'hsl(var(--color-purple))',
          'sun': 'hsl(var(--color-sun))',
          'sun-background': 'hsl(var(--color-sun-background))',
          'moon': 'hsl(var(--color-moon))',
          'moon-background': 'hsl(var(--color-moon-background))',
          'moon-border': 'hsl(var(--color-moon-border))',
          'theme-toggle-bg': 'hsl(var(--color-theme-toggle-bg))',
          'gray-light': 'hsl(var(--color-gray-light))',
          'section-bg': 'hsl(var(--color-section-bg))',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('tailwind-clip-path'), require('tailwindcss-animate')],
}
