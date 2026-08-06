import type { AstroExpressiveCodeOptions } from 'astro-expressive-code';
import type {
  FooterSection,
  DahliaThemeConfig,
  OverrideComponentsConfig,
  PageActionConfig,
  DocsNavConfig,
  SiteNavItem,
  ThemeSocialLink,
} from '../theme';

export interface DahliaMarkdownOptions {
  expressiveCode?: false | AstroExpressiveCodeOptions;
  calloutDirectives?: false;
  cjkFriendly?: boolean | 'auto';
  packageManagerTabs?: false;
  imageGallery?: false;
}

export interface DahliaIntegrationOptions {
  name?: DahliaThemeConfig['name'];
  description?: DahliaThemeConfig['description'];
  logo?: DahliaThemeConfig['logo'];
  favicon?: DahliaThemeConfig['favicon'];
  appearance?: Partial<DahliaThemeConfig['appearance']>;
  siteNav?: SiteNavItem[];
  /** @deprecated Use `siteNav` instead. */
  navbar?: SiteNavItem[];
  socials?: ThemeSocialLink[];
  docsNav?: DocsNavConfig[];
  /** @deprecated Use `docsNav` instead. */
  sidebars?: DocsNavConfig[];
  search?: DahliaThemeConfig['search'];
  assistant?: DahliaThemeConfig['assistant'];
  llms?: DahliaThemeConfig['llms'];
  pageActions?: PageActionConfig[];
  contributors?: DahliaThemeConfig['contributors'];
  components?: OverrideComponentsConfig;
  credits?: DahliaThemeConfig['credits'];
  docsBase?: string;
  source?: DahliaThemeConfig['source'];
  editLink?: DahliaThemeConfig['editLink'];
  defaultLocale?: DahliaThemeConfig['defaultLocale'];
  locales?: DahliaThemeConfig['locales'];
  ui?: DahliaThemeConfig['ui'];
  iconify?: Partial<NonNullable<DahliaThemeConfig['iconify']>>;
  markdown?: DahliaMarkdownOptions;
  footer?: {
    copyright?: string;
    sections?: FooterSection[];
  };
}

export function defineDahliaConfig(config: DahliaIntegrationOptions): DahliaIntegrationOptions {
  return config;
}
