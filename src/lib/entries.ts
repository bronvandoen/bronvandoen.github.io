import { getCollection, type CollectionEntry } from 'astro:content';
import tags from '../data/tags.json';

export type Entry = CollectionEntry<'entries'>;
export const kinds = { note: 'Working note', tool: 'Workshop tool', print: 'Print', statement: 'Statement' } as const;
export const tagLabel = (id: string) => (tags as Record<string, { label: string }>)[id]?.label ?? id;
export const tagList = tags as Record<string, { label: string; about: string }>;

/** All entries, newest first; same date sorts by title. */
export async function allEntries(): Promise<Entry[]> {
  return (await getCollection('entries')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title),
  );
}

/** The About page shows the newest statement tagged about. */
export async function currentAbout(): Promise<Entry | undefined> {
  return (await allEntries()).find((e) => e.data.kind === 'statement' && e.data.tags.includes('about'));
}

/** The entry that replaces this one, if any. */
export function supersededBy(entry: Entry, entries: Entry[]): Entry | undefined {
  return entries.find((e) => e.data.supersedes === entry.id);
}

export const entryUrl = (e: Entry) => `/entries/${e.id}/`;
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
