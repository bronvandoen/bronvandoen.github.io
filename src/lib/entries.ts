import { getCollection, type CollectionEntry } from 'astro:content';
import tags from '../data/tags.json';

export type Entry = CollectionEntry<'entries'>;
export const kinds = { note: 'Working note', tool: 'Workshop tool', print: 'Print', essay: 'Essay' } as const;
export type Kind = keyof typeof kinds;

/** Categories are the public name for kinds: one page each, in this order. */
export const categories: { kind: Kind; slug: string; label: string; about: string }[] = [
  { kind: 'note', slug: 'working-notes', label: 'Working notes', about: 'Short and raw: our voices and recollections from our work meetings.' },
  { kind: 'tool', slug: 'workshop-tools', label: 'Workshop tools', about: 'The tools we use with participants in our workshops. Anyone can try them.' },
  { kind: 'print', slug: 'prints', label: 'Prints', about: 'Flyers, posters and other printed material.' },
  { kind: 'essay', slug: 'essays', label: 'Essays', about: 'Writing between our raw notes and our published work.' },
];
export const categoryUrl = (kind: Kind) => `/categories/${categories.find((c) => c.kind === kind)!.slug}/`;
export const tagLabel = (id: string) => (tags as Record<string, { label: string }>)[id]?.label ?? id;
export const tagList = tags as Record<string, { label: string; about: string }>;

/** All entries, newest first; same date sorts by title. */
export async function allEntries(): Promise<Entry[]> {
  return (await getCollection('entries')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  );
}

/** The About page shows the newest entry tagged about; older ones stay as earlier versions. */
export const isAboutText = (e: Entry) => e.data.tags.includes('about');
export async function currentAbout(): Promise<Entry | undefined> {
  return (await allEntries()).find(isAboutText);
}

/** The entry that replaces this one, if any. */
export function supersededBy(entry: Entry, entries: Entry[]): Entry | undefined {
  return entries.find((e) => e.data.supersedes === entry.id);
}

export const entryUrl = (e: Entry) => `/entries/${e.id}/`;
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
