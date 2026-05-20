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

  let llmData = "";
  llmData += "# Smiling Dev Consulting smiling.dev\n\n";
  llmData += "> A consultancy for small and medium sized businesses looking for websites, web apps, fractional CTO services, and AI solutions.\n\n";

  llmData += "## Full Documentation\n\n";
  llmData += "- [Full Blog Content](https://smiling.dev/llms-full.txt): Complete blog posts with full content for deep context.\n\n";

  // Projects section (curated summary)
  llmData += "## Featured Projects\n\n";
  sortedProjects.slice(0, 6).forEach((project) => {
    llmData += `- [${project.data.title}](https://smiling.dev/projects/${project.data.slug}): ${project.data.description}\n`;
  });
  if (sortedProjects.length > 6) {
    llmData += `\n[View all projects](https://smiling.dev/projects)\n\n`;
  } else {
    llmData += "\n";
  }

  // Blog posts section (curated summary)
  llmData += "## Recent Blog Posts\n\n";
  sortedPosts.slice(0, 8).forEach((post) => {
    const date = new Date(post.data.updateDate || post.data.pubDate).toLocaleDateString();
    llmData += `- [${post.data.title}](https://smiling.dev/blog/${post.data.slug}): ${post.data.description}\n`;
    if (post.data.keywords && post.data.keywords.length > 0) {
      llmData += `  Tags: ${post.data.keywords.join(", ")}\n`;
    }
  });
  if (sortedPosts.length > 8) {
    llmData += `\n[View all blog posts](https://smiling.dev/blog)\n`;
  }

  return new Response(llmData, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};