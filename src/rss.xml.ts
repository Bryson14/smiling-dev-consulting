import rss, { type RSSFeedItem } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const blog = await getCollection("blog")
  const projects = await getCollection("projects");
  const blogPosts = blog.map(post => {
    return {
      title: post.data.title,
      description: post.data.description,
      pubData: post.data.pubDate.toISOString(),
      link: new URL(`/blog/${post.data.slug}`, context.site).href,
    }
  })

  const projectsPosts = projects.map(post => {
    return {
      title: post.data.title,
      description: post.data.description,
      pubData: post.data.updateDate.toISOString(),
      link: new URL(`/projects/${post.data.slug}`, context.site).href,
    }
  })

  const allPosts: RSSFeedItem[] = [...blogPosts, ...projectsPosts].sort((a, b) => new Date(b.pubData).getTime() - new Date(a.pubData).getTime());


  return rss({
    title: 'Smiling Dev Blog',
    description: 'Project Tech Consulting, Technical insights, tutorials, and industry best practices from Bryson Meiling.',
    site: context.site,
    items: allPosts.map(post => ({
      ...post,
    })),
    customData: `<language>en-us</language>`,
  });
}