import type { DahliaThemeConfig } from '../theme';

export type PagefindSearchConfig = Extract<DahliaThemeConfig['search'], { provider: 'pagefind' }>;

export function isPagefindSearchEnabled(config: DahliaThemeConfig): boolean {
  return config.search !== false && config.search.provider === 'pagefind';
}

export function getPagefindSearchConfig(config: DahliaThemeConfig): PagefindSearchConfig | undefined {
  return isPagefindSearchEnabled(config) ? config.search as PagefindSearchConfig : undefined;
}

export function getPagefindOutputSubdir(config: PagefindSearchConfig): string {
  return config.outputSubdir?.replace(/^\/+|\/+$/g, '') || 'pagefind';
}
