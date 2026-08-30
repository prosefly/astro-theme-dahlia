import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { defaultConfig } from '../src/lib/config/defaults';
import { resolveLlmsConfig } from '../src/lib/config/llms';
import {
  loadDahliaConfigFile,
  mergeDahliaConfigOptions,
  normalizeLegacyDahliaConfigOptions,
  normalizeDocsBasePath,
  resolveDahliaConfig,
} from '../src/lib/config/resolve';
import { getDahliaInjectedRoutes } from '../src/lib/routes';
import { buildPagefindIndex, loadPagefind } from '../src/lib/search/pagefind';

function getRoutePatterns(options: Parameters<typeof resolveDahliaConfig>[0]) {
  return getDahliaInjectedRoutes(resolveDahliaConfig(options)).map((route) => route.pattern);
}

describe('Dahlia config', () => {
  it('normalizes empty, relative, and trailing-slash docs bases', () => {
    expect(normalizeDocsBasePath()).toBe('/');
    expect(normalizeDocsBasePath('')).toBe('/');
    expect(normalizeDocsBasePath('docs')).toBe('/docs');
    expect(normalizeDocsBasePath('/docs/')).toBe('/docs');
    expect(normalizeDocsBasePath('//docs//api//')).toBe('/docs/api');
  });

  it('merges nested defaults without losing default objects', () => {
    const config = resolveDahliaConfig({
      appearance: {
        accent: 'emerald',
      },
      docsBase: 'docs',
      footer: {
        copyright: 'Copyright',
      },
    });

    expect(config.docsBase).toBe('/docs');
    expect(config.appearance).toEqual({
      ...defaultConfig.appearance,
      accent: 'emerald',
    });
    expect(config.footer).toEqual({
      ...defaultConfig.footer,
      copyright: 'Copyright',
    });
    expect(config.iconify).toEqual(defaultConfig.iconify);
  });

  it('keeps explicit empty page actions instead of falling back to defaults', () => {
    expect(resolveDahliaConfig({ pageActions: [] }).pageActions).toEqual([]);
  });

  it('loads theme.config.json and strips schema metadata', () => {
    const root = mkdtempSync(join(tmpdir(), 'dahlia-config-'));

    try {
      writeFileSync(join(root, 'theme.config.json'), JSON.stringify({
        $schema: 'https://prosefly.dev/schema/dahlia.json',
        name: 'JSON Docs',
        docsBase: 'docs',
        appearance: {
          accent: 'emerald',
        },
      }));

      const fileOptions = loadDahliaConfigFile(pathToFileURL(`${root}/`));

      expect(fileOptions).toEqual({
        name: 'JSON Docs',
        docsBase: 'docs',
        appearance: {
          accent: 'emerald',
        },
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('lets dahlia options override theme.config.json options', () => {
    const mergedOptions = mergeDahliaConfigOptions(
      {
        name: 'JSON Docs',
        docsBase: '/docs',
        appearance: {
          accent: 'emerald',
          radius: 'large',
        },
        footer: {
          copyright: 'JSON',
          sections: [{ title: 'JSON', links: [] }],
        },
        siteNav: [{ label: 'JSON', href: '/json' }],
      },
      {
        name: 'TS Docs',
        appearance: {
          radius: 'small',
        },
        footer: {
          copyright: 'TS',
        },
        siteNav: [{ label: 'TS', href: '/ts' }],
      },
    );

    expect(mergedOptions).toEqual({
      name: 'TS Docs',
      docsBase: '/docs',
      appearance: {
        accent: 'emerald',
        radius: 'small',
      },
      footer: {
        copyright: 'TS',
        sections: [{ title: 'JSON', links: [] }],
      },
      siteNav: [{ label: 'TS', href: '/ts' }],
    });
  });

  it('maps deprecated navbar and sidebars options to siteNav and docsNav', () => {
    const warnings: string[] = [];
    const options = normalizeLegacyDahliaConfigOptions(
      {
        navbar: [{ label: 'Docs', href: '/docs' }],
        sidebars: [{ label: 'Guides', items: ['overview'] }],
      },
      (message) => warnings.push(message),
    );

    expect(options).toEqual({
      siteNav: [{ label: 'Docs', href: '/docs' }],
      docsNav: [{ label: 'Guides', items: ['overview'] }],
    });
    expect(warnings).toEqual([
      'Dahlia config `navbar` is deprecated. Use `siteNav` instead.',
      'Dahlia config `sidebars` is deprecated. Use `docsNav` instead.',
    ]);

    const config = resolveDahliaConfig({
      navbar: [{ label: 'Docs', href: '/docs' }],
      sidebars: [{ label: 'Guides', items: ['overview'] }],
    });

    expect(config.siteNav).toEqual([{ label: 'Docs', href: '/docs' }]);
    expect(config.docsNav).toEqual([{ label: 'Guides', items: ['overview'] }]);
    expect('navbar' in config).toBe(false);
    expect('sidebars' in config).toBe(false);
  });

  it('keeps siteNav and docsNav when deprecated options are also present', () => {
    const options = normalizeLegacyDahliaConfigOptions({
      siteNav: [{ label: 'New', href: '/new' }],
      navbar: [{ label: 'Old', href: '/old' }],
      docsNav: [{ label: 'New Docs', items: ['new'] }],
      sidebars: [{ label: 'Old Docs', items: ['old'] }],
    });

    expect(options.siteNav).toEqual([{ label: 'New', href: '/new' }]);
    expect(options.docsNav).toEqual([{ label: 'New Docs', items: ['new'] }]);
    expect('navbar' in options).toBe(false);
    expect('sidebars' in options).toBe(false);
  });

  it('uses a fixed theme mode control without a theme mode control option', () => {
    expect('themeModeControl' in resolveDahliaConfig({})).toBe(false);
  });

  it('resolves boolean and full llms settings', () => {
    expect(resolveLlmsConfig(resolveDahliaConfig({ llms: false }))).toEqual({
      enabled: false,
      full: false,
    });
    expect(resolveLlmsConfig(resolveDahliaConfig({ llms: true }))).toEqual({
      enabled: true,
      full: false,
    });
    expect(resolveLlmsConfig(resolveDahliaConfig({ llms: { full: true } }))).toEqual({
      enabled: true,
      full: true,
    });
  });

  it('injects docs, markdown, llms, and local search routes from config', () => {
    expect(getRoutePatterns({})).toEqual([
      '/404',
      '/[...slug]',
      '/[...slug].md',
      '/llms.txt',
      '/search.json',
    ]);

    expect(getRoutePatterns({ docsBase: '/docs/' })).toEqual([
      '/404',
      '/docs/[...slug]',
      '/docs/[...slug].md',
      '/llms.txt',
      '/docs/search.json',
    ]);
  });

  it('only injects optional search and llms routes when enabled', () => {
    expect(getRoutePatterns({
      docsBase: '/docs',
      locales: {
        root: { label: 'English', directory: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN', directory: 'zh-cn' },
      },
    })).toContain('/docs/[locale]/search.json');

    expect(getRoutePatterns({
      llms: false,
      search: false,
    })).toEqual([
      '/404',
      '/[...slug]',
      '/[...slug].md',
    ]);

    expect(getRoutePatterns({
      search: {
        provider: 'docsearch',
        appId: 'APP',
        apiKey: 'KEY',
        indexName: 'docs',
      },
    })).toEqual([
      '/404',
      '/[...slug]',
      '/[...slug].md',
      '/llms.txt',
    ]);

    expect(getRoutePatterns({ llms: { full: true } })).toContain('/llms-full.txt');
  });

  it('does not load Pagefind for local or disabled search', async () => {
    const loadPagefindModule = async () => {
      throw new Error('Pagefind should not be loaded');
    };
    const logger = { info: () => {} };

    await expect(buildPagefindIndex(
      resolveDahliaConfig({ search: { provider: 'local' } }),
      new URL('file:///tmp/dahlia-pagefind-test/'),
      logger,
      loadPagefindModule,
    )).resolves.toBeUndefined();
    await expect(buildPagefindIndex(
      resolveDahliaConfig({ search: false }),
      new URL('file:///tmp/dahlia-pagefind-test/'),
      logger,
      loadPagefindModule,
    )).resolves.toBeUndefined();
  });

  it('loads Pagefind only for the Pagefind provider', async () => {
    let loaded = false;
    const pagefindModule = {
      createIndex: async () => ({
        errors: [],
        index: {
          addDirectory: async () => ({ errors: [], page_count: 0 }),
          writeFiles: async () => ({ errors: [] }),
          deleteIndex: async () => null,
        },
      }),
      close: async () => null,
    };

    await expect(buildPagefindIndex(
      resolveDahliaConfig({ search: { provider: 'pagefind' } }),
      new URL('file:///tmp/dahlia-pagefind-test/'),
      { info: () => {} },
      async () => {
        loaded = true;
        return pagefindModule;
      },
    )).resolves.toBeUndefined();
    expect(loaded).toBe(true);
  });

  it('reports how to install the optional Pagefind package when loading fails', async () => {
    await expect(loadPagefind(async () => {
      throw new Error('Cannot find package');
    })).rejects.toThrow('pnpm add pagefind');
  });
});
