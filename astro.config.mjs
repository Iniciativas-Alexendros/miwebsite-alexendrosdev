import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://alexendros.dev',
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  output: 'hybrid',
  // @astrojs/vercel@7.8 no admite runtime nodejs22.x; pnpm build aplica scripts/fix-vercel-runtime.mjs
  adapter: vercel({
    maxDuration: 10
  }),
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: { build: { cssMinify: true } }
});
