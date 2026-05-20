import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

const extractFrontmatter = (content: string): string => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  return frontmatterMatch ? frontmatterMatch[1] : "";
};

const cleanContent = (content: string): string => {
  // Remove the frontmatter delimiters
  let cleanedContent = content.replace(/^---\n[\s\S]*?\n---/, "");

  // Clean up MDX-specific imports
  cleanedContent = cleanedContent.replace(
    /import\s+.*\s+from\s+['"].*['"];?\s*/g,
    ""
  );

  // Remove MDX component declarations
  cleanedContent = cleanedContent.replace(/<\w+\s+.*?\/>/g, "");

  // Remove Shiki Twoslash syntax
  cleanedContent = cleanedContent.replace(/\/\/\s*@noErrors/g, "");
  cleanedContent = cleanedContent.replace(/\/\/\s*@(.*?)$/gm, "");

  // Clean up multiple newlines
  cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, "\n\n");

  return cleanedContent.trim();
};

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
  llmData += "# Smiling Dev Consulting - Full Content\n\n";
  llmData += "> Complete documentation with full blog posts and project details for deep context.\n\n";

  // Projects section with full details
  llmData += "## Projects\n\n";
  llmData += "A comprehensive list of projects we've worked on, including descriptions, technologies used, and key details.\n\n";

  sortedProjects.forEach((project) => {
    llmData += `### ${project.data.title}\n\n`;
    llmData += `**Link**: https://smiling.dev/projects/${project.data.slug}\n`;
    llmData += `**Description**: ${project.data.description}\n`;
    llmData += `**Technologies**: ${project.data.technologies.join(", ")}\n`;
    llmData += `**Updated**: ${new Date(project.data.updateDate).toLocaleDateString()}\n\n`;
  });

  // Blog posts section with full content
  llmData += "## Blog Posts\n\n";
  llmData += "Full content of all blog posts with metadata for comprehensive understanding.\n\n";

  for (const post of sortedPosts) {
    const pubDate = new Date(post.data.pubDate || "").toLocaleDateString();
    const updateDate = new Date(post.data.updateDate || post.data.pubDate || "").toLocaleDateString();

    llmData += `## ${post.data.title}\n\n`;
    llmData += `**URL**: https://smiling.dev/blog/${post.data.slug}\n`;
    llmData += `**Author**: ${post.data.author || "Unknown"}\n`;
    llmData += `**Published**: ${pubDate}\n`;
    if (post.data.updateDate && post.data.updateDate !== post.data.pubDate) {
      llmData += `**Updated**: ${updateDate}\n`;
    }
    if (post.data.keywords && post.data.keywords.length > 0) {
      llmData += `**Tags**: ${post.data.keywords.join(", ")}\n`;
    }
    llmData += `**Description**: ${post.data.description}\n\n`;

    // Add full content
    const processedContent = cleanContent(post.body ?? "");
    llmData += processedContent + "\n\n";

    // Add separator between posts
    llmData += "---\n\n";
  }

  return new Response(llmData, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
