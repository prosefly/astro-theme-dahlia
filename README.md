# Astro Theme Dahlia

Dahlia is an installable documentation theme for Astro 7. It provides docs
routing, navigation, search, i18n, MDX components, Expressive Code, Mermaid,
dark mode, and a configurable documentation shell.

![Dahlia documentation theme preview](public/images/og.jpg)

## Create a new site

Use the maintained starter template:

```sh
pnpm create astro@latest my-docs --template prosefly/astro-template-dahlia-starter
cd my-docs
pnpm dev
```

Starter source:
[prosefly/astro-template-dahlia-starter](https://github.com/prosefly/astro-template-dahlia-starter)

## Add Dahlia to an Astro project

Install the theme:

```sh
pnpm add @prosefly/astro-theme-dahlia
```

Register the integration:

```ts
// astro.config.ts
import { defineConfig } from 'astro/config';
import dahlia from '@prosefly/astro-theme-dahlia';

export default defineConfig({
  integrations: [dahlia()],
});
```

Register the docs collection:

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

Create `theme.config.json`:

```json
{
  "$schema": "https://prosefly.dev/schema/dahlia.json",
  "name": "Acme Docs",
  "description": "Documentation for Acme.",
  "docsNav": [
    {
      "label": "Guide",
      "icon": "lucide:book-open",
      "items": ["index"]
    }
  ]
}
```

Create `src/content/docs/index.mdx`:

```mdx
---
title: Overview
description: Learn how to use Acme.
---

Welcome to the Acme documentation.
```

Run `pnpm dev` and open `http://localhost:4321/`.

Install `@prosefly/astro-components` directly when your own MDX imports shared
components such as `Callout`, `Card`, `Steps`, `Tabs`, or `FileTree`.

## Documentation

- [Installation](https://astro-theme-dahlia.prosefly.dev/docs/installation/)
- [Write content](https://astro-theme-dahlia.prosefly.dev/docs/essentials/frontmatter/)
- [Configuration](https://astro-theme-dahlia.prosefly.dev/docs/references/configuration/)
- [MDX components](https://astro-theme-dahlia.prosefly.dev/docs/components/callout/)
- [Customization](https://astro-theme-dahlia.prosefly.dev/docs/customization/css-styling/)
- [Deployment](https://astro-theme-dahlia.prosefly.dev/docs/deployment/)

## Package scripts

```sh
pnpm lint
pnpm test
pnpm check
pnpm build
```

## License

BSD-3-Clause
