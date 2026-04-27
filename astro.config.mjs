// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import gtm from "astro-gtm-lite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://smiling.dev",

  integrations: [
    gtm({
      id: "GTM-WXRHVR6",
      devMode: true
    }),
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/private/"),
      }),
      gtm({
        id: "GTM-WXRHVR6"
      })
	],

  markdown: {
      shikiConfig: {
          themes: {
              light: "github-light",
              dark: "github-dark",
          },
      },
      syntaxHighlight: {
          excludeLangs: ["mermaid", "math"],
      },
	},

  image: {
      service: {
          entrypoint: "astro/assets/services/sharp",
      },
      layout: "constrained"
	},

  output: "static",
  compressHTML: true,

  build: {
      inlineStylesheets: "auto",
	},

  vite: {
      plugins: [tailwindcss()],
	},

  adapter: cloudflare(),
});