/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(0.14 0.01 240)',
        fg: 'oklch(0.96 0.01 80)',
        primary: 'oklch(0.75 0.18 95)',
        muted: 'oklch(0.72 0.02 240)',
        border: 'oklch(0.25 0.02 240)',
        card: 'oklch(0.18 0.015 240)'
      },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'monospace']
      }
    }
  },
  plugins: []
};
