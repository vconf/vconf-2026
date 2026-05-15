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
          'text-muted': 'hsl(var(--text-muted))',
          'black': 'hsl(var(--color-black))',
          'white': 'hsl(var(--background))',
          'primary': 'hsl(var(--color-primary))',
          'sun': 'hsl(var(--color-sun))',
          'sun-background': 'hsl(var(--color-sun-background))',
          'moon': 'hsl(var(--color-moon))',
          'moon-background': 'hsl(var(--color-moon-background))',
          'moon-border': 'hsl(var(--color-moon-border))',
          'theme-toggle-bg': 'hsl(var(--color-theme-toggle-bg))',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar'), require('tailwind-clip-path'), require('tailwindcss-animate')],
}
