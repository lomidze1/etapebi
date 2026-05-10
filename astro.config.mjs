import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://etapebi.com',
  trailingSlash: 'never',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
    mdx(),
  ],
  vite: {
    plugins: [
      {
        name: 'serve-admin-index',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url === '/admin/') {
              req.url = '/admin/index.html';
            }
            next();
          });
        },
      },
    ],
  },
});
