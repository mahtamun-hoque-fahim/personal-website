import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
      },
      fontFamily: {
        display: ['var(--font-clash)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      transitionTimingFunction: {
        'ui-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ui-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        marquee: 'marquee 30s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
