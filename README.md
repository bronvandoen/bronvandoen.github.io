# bronvandoen.github.io

Agents: read `CLAUDE.md` first.

Working notes, workshop tools and prototypes from Bron van Doen, the social and service design practice in Eindhoven that includes a Situated Studio. For our own groups and workshops; the pages are kept out of search engines.

## How it is built

The site is the Bron van Doen research archive, built with [Astro](https://astro.build) by the GitHub Action in `.github/workflows/deploy.yml`. Every push is built; only `main` is deployed to GitHub Pages (Settings > Pages > Source must be "GitHub Actions"). Locally: `npm ci`, then `npm run dev` or `npm run build` (Node 22.23.4 or newer).

## Where things go

- `src/pages/`: the archive's pages: home, About (the newest entry of kind `statement` tagged `about`), entries, tags, the RSS feed (`/rss.xml`) and the 404 page.
- `src/styles/tokens.css`: the design system's reading subset as CSS custom properties, in one file so the main website can reuse it. `src/styles/archive.css`: the archive's layout. Fonts are bundled from `@fontsource`, so pages load nothing from other servers.
- Pictures in an entry: put the file next to its `index.md` and write `![What the photo shows](./photo.jpg "Caption")` on its own line. It becomes a figure with the caption beneath; start the caption with `wide:` for a picture wider than the text. The alt text describes the picture; the caption says what it is and who took it. No faces without written consent.
- `src/content/entries/<id>/index.md`: one entry per folder, images next to it, served at `/entries/<id>/`. Keep the folder name once it is published: it is the entry's address. Fields (checked in `src/content.config.ts`): `title`, `date`, `summary`, `kind` (note, tool, print or statement), `tags`, and when they apply `updated`, `project`, `voices` (a list of names), `status` (working or settled), `supersedes` (the id of the entry it replaces), `href` (for a tool or print: the address of its page), `lang` (default `en`).
- `src/data/tags.json`: the list of tags. A tag must be listed here before an entry can use it.
- `public/view.html`: forwards the old reader's links (`view.html?post=<date>-<slug>`) to the entries.
- `public/tools/<project>/<tool>/index.html`: one workshop tool per folder, self-contained, copied to the site unchanged and served at `/tools/<project>/<tool>/`. Example: `public/tools/economic-cultures/hourly-rate/`.
- `public/prints/<project>/<print>/`: flat single images (flyers, posters, treated photos) as a page plus its exported image, served at `/prints/<project>/<print>/`.
- `_inbox/`: raw material. Never published.

## Licence

Code: MIT (`LICENSE`). Texts, images and prints: CC BY 4.0, credit a Situated Studio (`LICENSE-CONTENT.md`). Copyright holder: Bron van Doen V.O.F.
