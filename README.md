# bronvandoen.github.io

Working notes, workshop tools and prototypes from Bron van Doen, the social and service design practice in Eindhoven that includes a Situated Studio. For our own groups and workshops; the pages are kept out of search engines.

## How it is built

The site is the Bron van Doen research archive, built with [Astro](https://astro.build) by the GitHub Action in `.github/workflows/deploy.yml`. Every push is built; only `main` is deployed to GitHub Pages (Settings > Pages > Source must be "GitHub Actions"). Locally: `npm ci`, then `npm run dev` or `npm run build` (Node 22.23.4 or newer).

## Where things go

- `src/pages/`: the archive's pages (home, about, entries, tags, feed). The start page is a placeholder until the templates are built.
- `posts/<date>-<slug>/index.md`: one working note per folder, images next to it. Front matter: `title`, `date`, `summary`, `project` when it belongs to one, and `voices` (who speaks in it, e.g. `Gemma Medina and Minsung Wang`). Moves into the entries collection in the next step.
- `public/tools/<project>/<tool>/index.html`: one workshop tool per folder, self-contained, copied to the site unchanged and served at `/tools/<project>/<tool>/`. Example: `public/tools/economic-cultures/hourly-rate/`.
- `public/prints/<project>/<print>/`: flat single images (flyers, posters, treated photos) as a page plus its exported image, served at `/prints/<project>/<print>/`.
- `_inbox/`: raw material. Never published.
