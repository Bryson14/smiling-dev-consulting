// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://smiling.dev',

  integrations: [
    react(),
    mdx(),
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  vite: {
    plugins: [tailwindcss()]
  }
});