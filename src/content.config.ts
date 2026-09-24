import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stage: z.enum(['research', 'analysis', 'concept', 'development', 'visualization', 'communication']),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { articles };
