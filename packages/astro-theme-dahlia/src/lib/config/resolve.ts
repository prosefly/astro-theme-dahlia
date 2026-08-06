import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPublicImageDimensions } from '../image-size';
import type {
  DahliaThemeConfig,
  SidebarGroupItem,
  SidebarItemConfig,
} from '../theme';
import { defaultConfig, DEFAULT_DOCS_BASE_PATH } from './defaults';
import type { DahliaIntegrationOptions } from './options';

export const DAHLIA_CONFIG_FILE = 'theme.config.json';

type DahliaConfigFileOptions = DahliaIntegrationOptions & {
  $schema?: string;
};

type LegacyDahliaIntegrationOptions = Omit<DahliaIntegrationOptions, 'navbar' | 'sidebars'> & {
  navbar?: DahliaIntegrationOptions['siteNav'];
  sidebars?: DahliaIntegrationOptions['docsNav'];
};

const mergeableOptionKeys = new Set<keyof DahliaIntegrationOptions>([
  'appearance',
  'components',
  'footer',
  'iconify',
  'locales',
  'markdown',
  'source',
  'ui',
]);

export function resolveDahliaConfig(options: DahliaIntegrationOptions): DahliaThemeConfig {
  const normalizedOptions = normalizeLegacyDahliaConfigOptions(options);
  const {
    markdown: _markdown,
    themeModeControl: _themeModeControl,
    ...themeOptions
  } = normalizedOptions as DahliaIntegrationOptions & { themeModeControl?: unknown };

  return {
    ...defaultConfig,
    ...themeOptions,
    appearance: {
      ...defaultConfig.appearance,
      ...themeOptions.appearance,
    },
    pageActions: themeOptions.pageActions ?? defaultConfig.pageActions,
    docsBase: normalizeDocsBasePath(themeOptions.docsBase, defaultConfig.docsBase),
    iconify: {
      ...defaultConfig.iconify,
      ...themeOptions.iconify,
    },
    footer: {
      ...defaultConfig.footer,
      ...themeOptions.footer,
    },
  };
}

export function loadDahliaConfigFile(root: URL): DahliaIntegrationOptions {
  const configUrl = new URL(DAHLIA_CONFIG_FILE, root);
  if (!existsSync(configUrl)) {
    return {};
  }

  const configPath = fileURLToPath(configUrl);

  try {
    const fileConfig = JSON.parse(readFileSync(configUrl, 'utf8')) as DahliaConfigFileOptions;
    const { $schema: _schema, ...options } = fileConfig;

    return options;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read ${configPath}: ${message}`);
  }
}

export function mergeDahliaConfigOptions(
  ...configs: DahliaIntegrationOptions[]
): DahliaIntegrationOptions {
  const merged: DahliaIntegrationOptions = {};

  for (const config of configs) {
    mergeDefinedProperties(merged, config);
    for (const key of mergeableOptionKeys) {
      mergeObjectProperty(merged, config, key);
    }
  }

  return merged;
}

export function normalizeLegacyDahliaConfigOptions(
  options: DahliaIntegrationOptions,
  warn: (message: string) => void = () => {},
): DahliaIntegrationOptions {
  const legacyOptions = options as LegacyDahliaIntegrationOptions;
  const normalized: LegacyDahliaIntegrationOptions = { ...legacyOptions };

  if (legacyOptions.navbar !== undefined) {
    warn('Dahlia config `navbar` is deprecated. Use `siteNav` instead.');
    normalized.siteNav ??= legacyOptions.navbar;
    delete normalized.navbar;
  }

  if (legacyOptions.sidebars !== undefined) {
    warn('Dahlia config `sidebars` is deprecated. Use `docsNav` instead.');
    normalized.docsNav ??= legacyOptions.sidebars;
    delete normalized.sidebars;
  }

  return normalized;
}

export function resolveLocalAssetConfig(
  config: DahliaThemeConfig,
  publicDir: URL,
): DahliaThemeConfig {
  if (!config.logo || typeof config.logo === 'string') {
    return config;
  }

  if (config.logo.width && config.logo.height) {
    return config;
  }

  const dimensions =
    readPublicImageDimensions(config.logo.light, publicDir)
    ?? readPublicImageDimensions(config.logo.dark, publicDir);
  if (!dimensions) {
    return config;
  }

  return {
    ...config,
    logo: {
      ...config.logo,
      width: config.logo.width ?? dimensions.width,
      height: config.logo.height ?? dimensions.height,
    },
  };
}

export async function resolveAsyncDahliaConfig(config: DahliaThemeConfig): Promise<DahliaThemeConfig> {
  return {
    ...config,
    docsNav: await Promise.all(config.docsNav.map(async (sidebar) => ({
      ...sidebar,
      items: await resolveAsyncSidebarItems(await sidebar.items),
    }))),
  };
}

export function normalizeDocsBasePath(
  basePath?: string,
  fallback = DEFAULT_DOCS_BASE_PATH,
): string {
  const input = basePath?.trim() || fallback;
  const normalized = `/${input}`.replace(/\/+/g, '/').replace(/\/$/, '');

  return normalized || '/';
}

function mergeDefinedProperties(
  target: DahliaIntegrationOptions,
  source: DahliaIntegrationOptions,
) {
  for (const [key, value] of Object.entries(source) as Array<[keyof DahliaIntegrationOptions, unknown]>) {
    if (value !== undefined && !mergeableOptionKeys.has(key)) {
      target[key] = value as never;
    }
  }
}

function mergeObjectProperty<Key extends keyof DahliaIntegrationOptions>(
  target: DahliaIntegrationOptions,
  source: DahliaIntegrationOptions,
  key: Key,
) {
  const value = source[key];
  if (!isPlainObject(value)) {
    return;
  }

  const current = target[key];
  const currentObject: Record<string, unknown> = isPlainObject(current) ? current : {};
  const nextObject: Record<string, unknown> = {
    ...currentObject,
    ...value,
  };

  target[key] = nextObject as DahliaIntegrationOptions[Key];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

async function resolveAsyncSidebarItems(items: SidebarItemConfig[]): Promise<SidebarItemConfig[]> {
  return Promise.all(items.map(async (item): Promise<SidebarItemConfig> => {
    if (!item || typeof item !== 'object' || !('items' in item)) {
      return item;
    }

    return {
      ...item,
      items: await resolveAsyncSidebarItems(await item.items),
    } satisfies SidebarGroupItem;
  }));
}
