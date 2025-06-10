import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection("blog")
  const blogPosts = blog.map(post => {
    return {
      title: post.data.title,
      description: post.data.description,
      pubData: post.data.pubDate.toISOString(),
      link: `/blog/${post.data.slug}`
    }
  })

  return rss({
    title: 'Smiling Dev Blog',
    description: 'Technical insights, tutorials, and industry best practices from Bryson Meiling.',
    site: context.site,
    items: blogPosts.map(post => ({
      ...post,
      link: new URL(post.link, context.site).href
    })),
    customData: `<language>en-us</language>`,
  });
}