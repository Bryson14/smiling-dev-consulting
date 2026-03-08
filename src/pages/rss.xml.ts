import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIContext } from 'astro';

export const prerender = true;

export async function GET(context: APIContext) {
	const blog = await getCollection("blog");
	const projects = await getCollection("projects");
	const blogPosts = blog.map((post) => {
		return {
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: new URL(`/blog/${post.data.slug}`, context.site).href,
		};
	});

	const projectsPosts = projects.map((post) => {
		return {
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.updateDate,
			link: new URL(`/projects/${post.data.slug}`, context.site).href,
		};
	});

	const allPosts: RSSFeedItem[] = [...blogPosts, ...projectsPosts].sort(
		(a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
	);

	return rss({
		title: "Smiling Dev Consulting RSS Feed",
		description:
			"Project Tech Consulting, Technical insights, tutorials, and industry best practices from Bryson Meiling.",
		site: context.site || "https://smiling.dev",
		items: allPosts.map((post) => ({
			...post,
		})),
		customData: `<language>en-us</language>`,
	});
}
