import rss from '@astrojs/rss';

export async function GET(context) {
  // In a real implementation, you would fetch these from your content collections
  const posts = [
    {
      title: "Building High-Performance Web Applications with Astro",
      description: "Learn how to leverage Astro's unique architecture to create blazing-fast websites while maintaining a great developer experience.",
      pubDate: new Date('2025-04-15'),
      link: "/blog/building-high-performance-web-apps-astro"
    },
    {
      title: "Integrating OpenAI's GPT in Your Applications",
      description: "A comprehensive guide to implementing AI features in your web applications using OpenAI's GPT API.",
      pubDate: new Date('2025-04-10'),
      link: "/blog/integrating-openai-gpt-applications"
    },
    {
      title: "Modern SEO Practices for Developers",
      description: "Essential SEO techniques and best practices that every developer should know to build search-engine friendly websites.",
      pubDate: new Date('2025-04-05'),
      link: "/blog/modern-seo-practices-developers"
    }
  ];

  return rss({
    title: 'Smiling Dev Blog',
    description: 'Technical insights, tutorials, and industry best practices from Bryson Meiling.',
    site: context.site,
    items: posts.map(post => ({
      ...post,
      link: new URL(post.link, context.site).href
    })),
    customData: `<language>en-us</language>`,
  });
}