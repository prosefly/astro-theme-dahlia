# Astro Theme Dahlia

Dahlia is an installable documentation theme for Astro v7, Tailwind CSS v4, and
MDX. It gives your project generated docs routes, responsive navigation, table
of contents, search, dark mode, i18n, theme tokens, and docs components without
turning the whole site into a theme fork.

![Dahlia documentation theme preview](public/images/og.jpg)

## Quick Start

Start from the Dahlia starter template when you want a working documentation site
with Astro, content collections, theme config, and example docs already wired
up.

```sh
pnpm create astro@latest my-docs --template prosefly/astro-template-dahlia-starter
cd my-docs
pnpm dev
```

Template source:
[prosefly/astro-template-dahlia-starter](https://github.com/prosefly/astro-template-dahlia-starter)

## Add To An Existing Project

Install Dahlia manually when you already have an Astro project or want to add the
docs shell one piece at a time.

```sh
npm install @prosefly/astro-theme-dahlia
```

Install `@prosefly/astro-components` directly when your own MDX or Astro files
import shared components such as cards, steps, tabs, or callouts.

Add the integration:

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import dahlia from '@prosefly/astro-theme-dahlia';

export default defineConfig({
  integrations: [dahlia()],
});
```

Register your docs collection:

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { docsLoader, docsSchema } from '@prosefly/astro-theme-dahlia/content';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

export const collections = { docs };
```

Create docs in `src/content/docs/`. By default, Dahlia renders docs from the
site root: `src/content/docs/index.mdx` renders at `/`, and
`src/content/docs/installation.mdx` renders at `/installation/`.

## Configure

Create `theme.config.json` in the project root. Options passed to
`dahlia({...})` in `astro.config.ts` override values from this JSON file.

```json
{
  "$schema": "https://astro-theme-dahlia.prosefly.dev/schema.json",
  "name": "Acme Docs",
  "description": "Documentation for Acme.",
  "logo": "/images/logo.svg",
  "siteNav": [
    { "label": "Docs", "href": "/" },
    { "label": "GitHub", "href": "https://github.com/acme/acme", "external": true }
  ],
  "docsNav": [
    {
      "label": "Guides",
      "icon": "lucide:rocket",
      "items": [
        "overview",
        "installation",
        {
          "label": "Configuration",
          "items": [{ "autogenerate": { "directory": "configuration" } }]
        }
      ]
    }
  ]
}
```

## Features

- Astro v7 integration for documentation sites
- MDX content with configurable docs routes
- Full-height left navigation rail, right-side content with TOC, mobile docs menu, and footer
- Light, dark, and system theme modes
- Configurable accent color, gray palette, and radius
- Local search, Pagefind, and DocSearch providers
- i18n-aware routes, labels, and sidebar ownership
- Expressive Code support
- Iconify-powered icons
- Component overrides for shell pieces such as search, navigation, footer links,
  page metadata, and theme switch controls

## Links

- Documentation: <https://astro-theme-dahlia.prosefly.dev/docs/overview/>
- Starter template:
  <https://github.com/prosefly/astro-template-dahlia-starter>
- npm package: <https://www.npmjs.com/package/@prosefly/astro-theme-dahlia>

## License

BSD-3-Clause
