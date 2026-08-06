import { defineConfig } from 'astro/config';
import dahlia from '@prosefly/astro-theme-dahlia';

export default defineConfig({
  site: 'https://astro-theme-dahlia.prosefly.dev',
  integrations: [
    dahlia({
      components: {
        HeaderSocialIcons: './src/components/dahlia/HeaderSocialIcons.astro',
      },
    }),
  ],
});
