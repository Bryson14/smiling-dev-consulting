// @ts-check

import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://smiling.dev",

	integrations: [react(), mdx(), sitemap()],
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
	},

	compressHTML: true,

	build: {
		inlineStylesheets: "auto",
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
