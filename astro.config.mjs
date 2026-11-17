// The Bron van Doen research archive, served from the organisation's Pages site.
// Files in public/ (the workshop tools and the prints) are copied to the site unchanged.
import { defineConfig } from 'astro/config';
import rehypeFigures from './src/lib/rehype-figures.mjs';

export default defineConfig({
  site: 'https://bronvandoen.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // An entry folded into another keeps working at its old address.
  redirects: { '/entries/economic-cultures-module-5-part-1-2026-11-05': '/entries/economic-cultures-module-5-part-2-2026-11-10/' },
  markdown: { rehypePlugins: [rehypeFigures] },
});
