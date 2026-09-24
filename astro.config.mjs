import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set SITE_URL to your real domain in GitHub repository variables.
  site: process.env.SITE_URL || 'https://example.com',
  // Use / for a custom domain. Set /repository-name/ only when previewing
  // at username.github.io/repository-name/ without a custom domain.
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
