// The Bron van Doen research archive, served from the organisation's Pages site.
// Files in public/ (the workshop tools and the prints) are copied to the site unchanged.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bronvandoen.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
