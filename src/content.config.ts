import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
    schema: ({ image }) => z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/, "Project slugs must be lowercase and can only contain letters, numbers, and hyphens."),
        title: z.string(),
        description: z.string(),
        author: z.string(),
        pubDate: z.date(),
        updateDate: z.date().optional(),
        mediumLink: z.string().url().optional(),
        keywords: z.array(z.string()),
        image: image()
    })
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/projects" }),
    schema: ({ image }) => z.object({
        slug: z.string().regex(/^[a-z0-9-]+$/, "Project slugs must be lowercase and can only contain letters, numbers, and hyphens."),
        title: z.string(),
        description: z.string(),
        status: z.enum(['active', 'finished', 'in-progress']),
        updateDate: z.date(),
        keywords: z.array(z.string()),
        technologies: z.array(z.string()),
        image: image().optional()
    })

})

export const collections = { blog, projects };