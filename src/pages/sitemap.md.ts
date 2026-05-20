import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const projects = await getCollection("projects");

  const sortedPosts = posts.sort((a, b) => {
    const dateA = new Date(a.data.updateDate || a.data.pubDate);
    const dateB = new Date(b.data.updateDate || b.data.pubDate);
    return dateB.getTime() - dateA.getTime();
  });

  const sortedProjects = projects.sort((a, b) => {
    const dateA = new Date(a.data.updateDate);
    const dateB = new Date(b.data.updateDate);
    return dateB.getTime() - dateA.getTime();
  });

  let sitemapData = "";
  sitemapData += "# Smiling Dev Consulting - Sitemap\n\n";
  sitemapData += "Complete index of all pages and content on Smiling Dev Consulting.\n\n";

  // Main pages
  sitemapData += "## Main Pages\n\n";
  sitemapData += "- [Home](https://smiling.dev/): Homepage\n";
  sitemapData += "- [About](https://smiling.dev/about/): About Smiling Dev Consulting\n";
  sitemapData += "- [Blog](https://smiling.dev/blog/): All blog posts\n";
  sitemapData += "- [Projects](https://smiling.dev/projects/): Portfolio of projects\n\n";

  // LLM-specific resources
  sitemapData += "## LLM & Agent Resources\n\n";
  sitemapData += "- [LLMs.txt](https://smiling.dev/llms.txt): Curated content index for AI agents\n";
  sitemapData += "- [LLMs Full](https://smiling.dev/llms-full.txt): Complete content with full blog posts\n";
  sitemapData += "- [RSS Feed](https://smiling.dev/rss.xml): Blog RSS feed\n\n";

  // Projects section
  sitemapData += "## Projects\n\n";
  sortedProjects.forEach((project) => {
    const date = new Date(project.data.updateDate).toLocaleDateString();
    sitemapData += `- [${project.data.title}](https://smiling.dev/projects/${project.data.slug}) — *Updated ${date}*\n`;
  });

  sitemapData += "\n";

  // Blog posts section
  sitemapData += "## Blog Posts\n\n";
  sortedPosts.forEach((post) => {
    const date = new Date(post.data.updateDate || post.data.pubDate).toLocaleDateString();
    sitemapData += `- [${post.data.title}](https://smiling.dev/blog/${post.data.slug}) — *${date}*\n`;
    if (post.data.keywords && post.data.keywords.length > 0) {
      sitemapData += `  \`${post.data.keywords.slice(0, 3).join("`, `")}\`\n`;
    }
  });

  return new Response(sitemapData, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
