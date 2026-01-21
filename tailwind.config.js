/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "#0D9488", // teal-600
					50: "#F0FDFA",
					100: "#CCFBF1",
					200: "#99F6E4",
					300: "#5EEAD4",
					400: "#2DD4BF",
					500: "#14B8A6",
					600: "#0D9488",
					700: "#0F766E",
					800: "#115E59",
					900: "#134E4A",
					950: "#042F2E",
				},
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						color: theme("colors.gray.700"),
						a: {
							color: theme("colors.brand.600"),
							"&:hover": {
								color: theme("colors.brand.700"),
							},
						},
						"h1,h2,h3,h4": {
							color: theme("colors.gray.900"),
							fontWeight: theme("fontWeight.bold"),
						},
						pre: {
							backgroundColor: theme("colors.gray.900"),
							color: theme("colors.gray.100"),
						},
						code: {
							color: theme("colors.brand.600"),
							"&::before": {
								content: '"`"',
							},
							"&::after": {
								content: '"`"',
							},
						},
						"code::before": {
							content: "none",
						},
						"code::after": {
							content: "none",
						},
						"pre code": {
							color: "inherit",
							"&::before": {
								content: "none",
							},
							"&::after": {
								content: "none",
							},
						},
						table: {
							width: "100%",
							borderCollapse: "collapse",
							marginTop: theme("spacing.6"),
							marginBottom: theme("spacing.6"),
						},
						thead: {
							borderBottom: `2px solid ${theme("colors.brand.600")}`,
						},
						"thead th": {
							color: theme("colors.gray.900"),
							fontWeight: theme("fontWeight.semibold"),
							textAlign: "left",
							padding: `${theme("spacing.3")} ${theme("spacing.4")}`,
							backgroundColor: theme("colors.brand.50"),
						},
						"tbody tr": {
							borderBottom: `1px solid ${theme("colors.gray.200")}`,
						},
						"tbody tr:hover": {
							backgroundColor: theme("colors.gray.50"),
						},
						"tbody td": {
							padding: `${theme("spacing.3")} ${theme("spacing.4")}`,
						},
					},
				},
			}),
		},
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				sm: "2rem",
				lg: "4rem",
				xl: "5rem",
				"2xl": "6rem",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
