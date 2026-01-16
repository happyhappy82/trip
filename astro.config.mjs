import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://www.thetripguide.xyz',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind(),
  ],
  build: {
    format: 'directory'
  }
});
