declare module 'virtual:prosefly/dahlia/config' {
  import type { DahliaThemeConfig } from './lib/theme';

  const config: DahliaThemeConfig;
  export default config;
}

declare module 'virtual:prosefly/dahlia/styles.css' {}

declare namespace App {
  interface Locals {
    t: import('./lib/translations').DahliaTranslate;
  }
}

declare module 'virtual:prosefly/dahlia/components/Assistant' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/FooterLinks' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/SearchDialog' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/HeaderNavbar' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/HeaderSocialIcons' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/PageActions' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/PageAside' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/PageHeader' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/PageMeta' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/PageNavigation' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}

declare module 'virtual:prosefly/dahlia/components/SiteBrand' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}
