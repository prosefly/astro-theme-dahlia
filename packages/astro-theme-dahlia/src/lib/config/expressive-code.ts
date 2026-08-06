import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { expressiveCodeHeaderIcons } from '@prosefly/astro-components/expressive-code';
import {
  mergeEcConfigOptions,
  type AstroExpressiveCodeOptions,
} from 'astro-expressive-code';
import type { DahliaMarkdownOptions } from './options';

function createInlineSvgUrl(svgContents: string[]): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svgContents.join(''))}")`;
}

const lucideCopyIcon = createInlineSvgUrl([
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
  `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>`,
  `<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`,
  `</svg>`,
]);

const defaultExpressiveCodeOptions: AstroExpressiveCodeOptions = {
  themes: ['github-light', 'github-dark'],
  plugins: [pluginLineNumbers(), expressiveCodeHeaderIcons()],
  defaultProps: {
    showLineNumbers: false,
  },
  useDarkModeMediaQuery: true,
  customizeTheme: (theme) => {
    theme.name = theme.type === 'dark' ? 'dark' : 'light';
  },
  useThemedScrollbars: false,
  styleOverrides: {
    borderRadius: 'var(--dahlia-radius-lg)',
    borderWidth: '1px',
    borderColor: 'var(--dahlia-code-border)',
    codeBackground: 'var(--dahlia-background)',
    codeForeground: 'var(--dahlia-text)',
    codeFontFamily: 'var(--dahlia-font-mono)',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7142857',
    uiFontFamily: 'var(--dahlia-font-sans)',
    uiFontSize: '0.8125rem',
    focusBorder: 'var(--dahlia-accent)',
    scrollbarThumbColor: 'color-mix(in oklab, var(--dahlia-text-muted) 70%, transparent)',
    scrollbarThumbHoverColor: 'var(--dahlia-text-muted)',
    frames: {
      copyIcon: lucideCopyIcon,
    },
  },
};

export function resolveExpressiveCodeOptions(
  options: DahliaMarkdownOptions['expressiveCode'],
): AstroExpressiveCodeOptions | false {
  if (options === false) {
    return false;
  }

  return mergeEcConfigOptions(defaultExpressiveCodeOptions, options ?? {});
}
