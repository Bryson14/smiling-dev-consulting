import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/blog" }),
    schema: ({image}) => z.object({
        slug: z.string(),
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

export const collections = { blog };