export async function GET({ site }) {
  // In a real implementation, you would dynamically generate these from your routes/content
  const pages = [
    '',
    'about',
    'projects',
    'contact',
    'blog',
    'blog/building-high-performance-web-apps-astro',
    'blog/integrating-openai-gpt-applications',
    'blog/modern-seo-practices-developers',
  ];

  const siteUrl = site?.toString() || 'https://smiling.dev';

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages.map(page => `
        <url>
          <loc>${new URL(page, siteUrl).href}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>
      `).join('')}
    </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
}