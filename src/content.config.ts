// The research archive has one collection: entries.
// Fields follow the SPEC, section "Public research archive".
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import tags from './data/tags.json';

const tagIds = Object.keys(tags) as [string, ...string[]];

const entries = defineCollection({
  // One folder per entry: src/content/entries/<id>/index.md, images beside it.
  // The folder name is the entry's address: /entries/<id>/.
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/entries',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z
    .object({
      title: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      summary: z.string(),
      tags: z.array(z.enum(tagIds)).min(1),
      kind: z.enum(['note', 'tool', 'print', 'essay']),
      lang: z.string().default('en'),
      project: z.string().optional(),
      voices: z.array(z.string()).optional(),
      supersedes: z.string().optional(),
      // Tools and prints: where the static page lives (under public/).
      href: z.string().optional(),
      // Optional picture for the card and the entry page (a path under public/), with its alt text.
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      // Voice memo: the audio file (a path under public/audio/) and its length as m:ss.
      audio: z.string().optional(),
      audioLength: z.string().regex(/^\d+:\d\d$/).optional(),
    })
    .refine((e) => !['tool', 'print'].includes(e.kind) || e.href, {
      message: 'A tool or print entry needs href, the address of its page.',
    })
    .refine((e) => !e.image || e.imageAlt, { message: 'An image needs imageAlt, a description of what it shows.' })
    .refine((e) => !e.audio || e.audioLength, { message: 'An audio entry needs audioLength, as m:ss.' }),
});

export const collections = { entries };
