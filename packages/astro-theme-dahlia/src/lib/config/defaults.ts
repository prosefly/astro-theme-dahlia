import type { DahliaThemeConfig } from '../theme';

export const DEFAULT_DOCS_BASE_PATH = '/';

export const defaultConfig: DahliaThemeConfig = {
  name: 'Documentation',
  description: 'Project documentation.',
  favicon: undefined,
  appearance: {
    accent: '#B83F6F',
    gray: 'neutral',
    defaultMode: 'system',
    radius: 'medium',
  },
  siteNav: [{ label: 'Docs', href: '/' }],
  socials: [],
  docsNav: [],
  search: { provider: 'local' },
  assistant: false,
  llms: true,
  pageActions: [
    { type: 'copy-page', icon: 'lucide:copy' },
    { type: 'view-markdown', icon: 'lucide:file-text' },
    { type: 'open-chatgpt', icon: 'simple-icons:openai' },
    { type: 'open-claude', icon: 'simple-icons:claude' },
  ],
  contributors: false,
  components: {},
  credits: true,
  docsBase: DEFAULT_DOCS_BASE_PATH,
  source: undefined,
  editLink: undefined,
  defaultLocale: undefined,
  locales: undefined,
  ui: undefined,
  iconify: {
    apiBase: 'https://api.iconify.design',
    preload: [],
    scan: true,
  },
  footer: {
    copyright: '',
    sections: [],
  },
};
