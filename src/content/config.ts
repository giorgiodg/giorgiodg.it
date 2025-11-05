import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    position: z.number(),
  }),
});

const showcase = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    details: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    URL: z.string().optional(),
    repoURL: z.string().optional(),
  }),
});

export const collections = { blog, work, showcase };
