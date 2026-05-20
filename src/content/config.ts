import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      location: z.string(),
      buildingClass: z.string(),
      permitDate: z.coerce.date(),
      permitValidUntil: z.coerce.date(),
      buildingType: z.string(),
      stagesTotal: z.coerce.number().int().min(1).max(10).default(5),
      stagesCompleted: z
        .array(z.coerce.number().int().min(1).max(10))
        .default([]),
      coverImage: image().optional(),
      gallery: z.array(image()).default([]),
      description: z.string(),
      publishedAt: z.coerce.date(),
    }),
});

export const collections = { projects };
