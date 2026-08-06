import mdx from '@astrojs/mdx';
import proseflyIcon from '@prosefly/astro-components/icon';
import tailwindcss from '@tailwindcss/vite';
import astroExpressiveCode from 'astro-expressive-code';
import type { AstroIntegration } from 'astro';
import {
  defineDahliaConfig,
  loadDahliaConfigFile,
  dahliaConfigPlugin,
  mergeDahliaConfigOptions,
  normalizeLegacyDahliaConfigOptions,
  resolveAsyncDahliaConfig,
  resolveExpressiveCodeOptions,
  resolveLocalAssetConfig,
  resolveDahliaConfig,
  resolveMarkdownConfig,
  type DahliaIntegrationOptions,
} from './lib/config/index';
import { componentOverridePlugin } from './lib/overriding';
import { getDahliaInjectedRoutes } from './lib/routes';
import { buildPagefindIndex } from './lib/search/pagefind';
import { getIconPreloadNames } from './lib/preload-icons';
import { dahliaStylesPlugin } from './lib/styles';

export default function dahlia(options: DahliaIntegrationOptions = {}): AstroIntegration {
  let config = resolveDahliaConfig(normalizeLegacyDahliaConfigOptions(options));

  return {
    name: '@prosefly/astro-theme-dahlia',
    hooks: {
      'astro:config:setup': async ({
        addMiddleware,
        config: astroConfig,
        injectRoute,
        logger,
        updateConfig,
      }) => {
        const fileOptions = loadDahliaConfigFile(astroConfig.root);
        const mergedOptions = normalizeLegacyDahliaConfigOptions(
          mergeDahliaConfigOptions(fileOptions, options),
          (message) => logger.warn(message),
        );
        const expressiveCodeOptions = resolveExpressiveCodeOptions(
          mergedOptions.markdown?.expressiveCode,
        );

        config = resolveDahliaConfig(mergedOptions);
        config = resolveLocalAssetConfig(config, astroConfig.publicDir);
        config = await resolveAsyncDahliaConfig(config);

        for (const route of getDahliaInjectedRoutes(config)) {
          injectRoute(route);
        }

        addMiddleware({
          order: 'pre',
          entrypoint: new URL('./middleware.ts', import.meta.url),
        });

        updateConfig({
          markdown: resolveMarkdownConfig(mergedOptions, astroConfig.markdown),
          integrations: [
            ...(expressiveCodeOptions === false
              ? []
              : [astroExpressiveCode(expressiveCodeOptions)]),
            mdx(),
            proseflyIcon({
              apiBase: config.iconify?.apiBase,
              preload: getIconPreloadNames(config),
              scan: config.iconify?.scan,
            }),
          ],
          vite: {
            plugins: [
              dahliaConfigPlugin(config),
              componentOverridePlugin(config.components ?? {}, astroConfig.root),
              dahliaStylesPlugin(astroConfig.root, astroConfig.srcDir),
              tailwindcss(),
            ],
          },
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        await buildPagefindIndex(config, dir, logger);
      },
    },
  };
}

export { defineDahliaConfig, dahlia };
export type {
  DahliaIntegrationOptions,
  DahliaMarkdownOptions,
} from './lib/config/index';
export type {
  DocsNavConfig,
  FooterSection,
  LocaleConfig,
  DahliaThemeConfig,
  OverrideComponentName,
  OverrideComponentsConfig,
  PageActionConfig,
  RadiusScale,
  SearchConfig,
  SidebarItemConfig,
  SiteNavItem,
  ThemeAccent,
  ThemeLogo,
  ThemeLogoConfig,
  ThemeMode,
  ThemeSocialLink,
} from './lib/theme';
export type {
  NormalizedLocale,
} from './lib/i18n';
