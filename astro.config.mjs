// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Dev only: serve public/admin/index.html at /admin (production hosts do this already). */
const adminInDev = {
  name: 'admin-index-in-dev',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html';
      next();
    });
  },
};

// If you move to a custom domain, change `site` (and public/robots.txt).
export default defineConfig({
  site: 'https://roji-stack.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: { plugins: [adminInDev] },
  image: {
    // Uploads live in src/assets/media and are resized/compressed at build time.
    responsiveStyles: false,
  },
});
