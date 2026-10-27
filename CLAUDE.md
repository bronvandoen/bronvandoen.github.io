# Working in this repository

This is the Bron van Doen research archive, an Astro site served at https://bronvandoen.github.io. Every push to `main` is built and deployed by `.github/workflows/deploy.yml`. Pushing to `main` is publishing: do it only after Minsung says "publish", after he has seen a preview.

This file is the current layout. Where the `situated-studio-lead` skill and this file disagree, this file wins.

## Where things go

| What | Where | Served at |
| --- | --- | --- |
| An entry (working note, tool, print, statement) | `src/content/entries/<id>/index.md`, images beside it | `/entries/<id>/` |
| A workshop tool, self-contained HTML | `public/tools/<project>/<tool>/index.html` | `/tools/<project>/<tool>/` |
| A print (flyer, poster) and its exported image | `public/prints/<project>/<print>/` | `/prints/<project>/<print>/` |
| Tags | `src/data/tags.json` (a tag must be listed here before an entry uses it) | `/tags/<tag>/` |
| Tokens and styles | `src/styles/tokens.css`, `src/styles/archive.css` | |

Files in `public/` are copied to the site byte for byte. Anything at the repository root outside `src/` and `public/` is not served.

## Entry fields

Checked by `src/content.config.ts`; the build stops on a mistake.

- Always: `title`, `date`, `summary`, `kind` (`note`, `tool`, `print` or `statement`), `tags`.
- A tool or print: `href`, the address of its page (`/tools/...` or `/prints/...`).
- When they apply: `updated` (the date of a later change), `project`, `voices` (a list of names), `status` (`working` or `settled`), `supersedes` (the id of the entry it replaces), `image` and `imageAlt` (a picture under `public/` for the card), `lang` (default `en`).
- The folder name is the entry's address. Never rename a published one.

## Licence and indexing

- Texts, images and prints are CC BY 4.0, crediting a Situated Studio (`LICENSE-CONTENT.md`). The code (site and tools) is MIT (`LICENSE`). Copyright holder: Bron van Doen V.O.F. Quotes and photographs credited to someone else stay theirs.
- Home, About, entries and tags are indexable. Tools, prints and the 404 page carry `<meta name="robots" content="noindex">`: in a hand-built page under `public/` write the tag in the `<head>`; in an Astro page pass `noindex` to the `Base` layout.

## Recipes

**Update a tool or print** (for example new dates on a flyer):
1. Change the files in `public/prints/<project>/<print>/` (or `public/tools/...`) in place, keeping their names, so the URL and the entry's `image` stay valid. Re-export the image if the print changed.
2. In the matching entry (`src/content/entries/<id>/index.md`), add or change `updated: <YYYY-MM-DD>`, and adjust `summary` if it no longer fits. Do not change `date`.
3. Build and check (below), show Minsung a preview, push to `main` on his "publish".

**Add a new tool or print**: put its files under `public/`, then add an entry with `kind`, `href` and a one- or two-sentence `summary` in the studio's voice (skill `situated-studio-voice`). Add a tag to `src/data/tags.json` only if no existing tag fits.

**Add a working note**: a new folder in `src/content/entries/`, `kind: note`, `voices` for everyone whose words are in it, `status: working`. Pictures go beside `index.md` as `![What it shows](./photo.jpg "Caption. Photo: Name.")` on their own line; start the caption with `wide:` for a wide picture.

**Change the About page**: it shows the newest `statement` tagged `about`. A wording fix edits that entry and sets `updated`. A changed position is a new statement entry with `supersedes: <old id>`; the old one stays.

## Build and check

- Node 22.23.4 or newer: `npm ci`, then `npm run build`. The build must pass.
- Look at the changed pages at phone width (375px): no sideways scroll, text readable.
- Before publishing, confirm: no Dutch text that Ron has not read; nothing that belongs to a client, is sensitive, or that we want to keep private (everything here is CC BY 4.0, so publishing it licenses it); images, sound and fonts in entries, tools and prints are ours or free to use, with credit.
- After pushing to `main`, wait for the Action to finish, open the live page and send Minsung the link. Roll back with `git revert`, never a force push.
