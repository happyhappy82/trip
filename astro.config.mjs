import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://thetripguide.xyz',
  output: 'hybrid',
  adapter: vercel(),
  trailingSlash: 'always',
  integrations: [
    tailwind(),
  ],
  build: {
    format: 'directory'
  }
});
