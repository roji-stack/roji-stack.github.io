import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Project schema. public/admin/config.yml mirrors these fields 1:1 —
 * if you add or rename a field here, update the CMS config too.
 *
 * The CMS writes "" for optional fields left empty, so optional strings and
 * dates treat "" the same as "not set".
 */
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optText = z.preprocess(blank, z.string().optional());
const optDate = z.preprocess(blank, z.coerce.date().optional());

export const SECTIONS = [
  { key: 'overview', title: 'Overview' },
  { key: 'problem', title: 'Problem / Requirements' },
  { key: 'approach', title: 'Approach / Design' },
  { key: 'build', title: 'Build' },
  { key: 'testing', title: 'Testing & Results' },
  { key: 'differently', title: 'What I’d do differently' },
] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      endDate: optDate,
      ongoing: z.boolean().default(false),
      summary: z.string(),
      role: optText,
      tags: z.array(z.string()).default([]),
      cover: optText,
      coverAlt: optText,
      gallery: z
        .array(z.object({ image: z.string(), alt: z.string(), caption: optText }))
        .nullish()
        .transform((v) => v ?? []),
      links: z
        .array(z.object({ label: z.string(), url: z.string() }))
        .nullish()
        .transform((v) => v ?? []),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      overview: optText,
      problem: optText,
      approach: optText,
      build: optText,
      testing: optText,
      differently: optText,
    })
    .refine((p) => !p.cover || !!p.coverAlt, {
      error: 'coverAlt (alt text) is required when a cover image is set',
      path: ['coverAlt'],
    }),
});

export const collections = { projects };
