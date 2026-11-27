// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import partytown from "@astrojs/partytown";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://smiling.dev",

  env: {
    schema: {
      // Read at runtime on Cloudflare; never bundled into client code.
      PROPOSAL_LUCKY_DUCK_USERNAME: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      PROPOSAL_LUCKY_DUCK_PASSWORD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },

  integrations: [
    svelte(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes("/private/"),
    }),
    partytown(),
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
    layout: "constrained",
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
