import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://alexendros.dev',
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  output: 'hybrid',
  adapter: vercel({
    maxDuration: 10
  }),
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  vite: { build: { cssMinify: true } }
});
