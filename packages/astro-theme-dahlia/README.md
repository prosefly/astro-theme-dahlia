# @prosefly/astro-theme-dahlia

Installable documentation theme for Astro v7, Tailwind CSS v4, and MDX.

Dahlia gives your Astro project generated docs routes, responsive navigation,
table of contents, search, dark mode, i18n, theme tokens, and docs components
without turning the whole site into a theme fork.

## Start From The Template

Use the starter template for a new documentation site.

```sh
pnpm create astro@latest my-docs --template prosefly/astro-template-dahlia-starter
cd my-docs
pnpm dev
```

Template source:
[prosefly/astro-template-dahlia-starter](https://github.com/prosefly/astro-template-dahlia-starter)

## Add To An Existing Project

```sh
npm install @prosefly/astro-theme-dahlia
```

Install `@prosefly/astro-components` directly when your own MDX or Astro files
import shared components such as cards, steps, tabs, or callouts.

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import dahlia from '@prosefly/astro-theme-dahlia';

export default defineConfig({
  integrations: [dahlia()],
});
```

```json
{
  "$schema": "https://prosefly.dev/schema/dahlia.json",
  "name": "My Docs",
  "description": "Documentation for my project.",
  "siteNav": [
    { "label": "Docs", "href": "/" },
    { "label": "GitHub", "href": "https://github.com/acme/acme", "external": true }
  ],
  "docsNav": [
    {
      "label": "Guides",
      "items": ["index"]
    }
  ]
}
```

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

Add MDX pages in `src/content/docs/`. By default, Dahlia renders those pages
from the site root, similar to Starlight: `src/content/docs/index.mdx` renders
at `/`, and nested files render as matching URL segments. Set
`docsBase` when you want docs under a prefix such as `/docs`.

Dahlia renders the bundled left-navigation docs layout with a right-side TOC,
search, mobile docs menu, and footer. The integration also injects a Markdown source route at `*.md` and a
search index route at `search.json`.

Common integration options include `docsBase`, `siteNav`, `docsNav`,
`pageActions`, `footer`, `iconify`, `markdown`, and `components` overrides.

## Links

- Documentation: <https://astro-theme-dahlia.prosefly.dev/docs/overview/>
- Repository: <https://github.com/prosefly/astro-theme-dahlia>
- Starter template:
  <https://github.com/prosefly/astro-template-dahlia-starter>
