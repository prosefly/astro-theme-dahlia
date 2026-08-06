export {};

declare global {
  interface Window {
    __dahliaDocSearchReady?: boolean;
    docsearch?: (props: DocSearchProps) => DocSearchInstance;
  }
}

interface DocSearchInstance {
  open(): void;
}

interface DocSearchProps {
  container: HTMLElement;
  appId: string;
  apiKey: string;
  indexName: string;
  askAi?: string;
  disableUserPersonalization?: boolean;
  insights?: boolean;
  maxResultsPerGroup?: number;
  placeholder?: string;
  searchParameters?: Record<string, unknown>;
  keyboardShortcuts?: {
    'Ctrl/Cmd+K'?: boolean;
    '/'?: boolean;
  };
}

const defaultCssUrl = 'https://cdn.jsdelivr.net/npm/@docsearch/css@4';
const defaultJsUrl = 'https://cdn.jsdelivr.net/npm/@docsearch/js@4';

function getOptionalBoolean(element: HTMLElement, name: string): boolean | undefined {
  const value = element.dataset[name];

  if (value === undefined) {
    return undefined;
  }

  return value === 'true';
}

function getOptionalNumber(element: HTMLElement, name: string): number | undefined {
  const value = element.dataset[name];

  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function getSearchParameters(element: HTMLElement): Record<string, unknown> | undefined {
  const value = element.dataset.dahliaDocsearchSearchParameters;

  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value);

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : undefined;
  } catch {
    return undefined;
  }
}

function loadStylesheet(href: string): Promise<void> {
  const existing = document.querySelector<HTMLLinkElement>(`link[data-dahlia-docsearch-css="${href}"]`);

  if (existing) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.dataset.dahliaDocsearchCss = href;
    link.href = href;
    link.rel = 'stylesheet';
    link.addEventListener('load', () => resolve(), { once: true });
    link.addEventListener('error', () => reject(new Error(`Unable to load DocSearch CSS: ${href}`)), { once: true });
    document.head.append(link);
  });
}

function loadScript(src: string): Promise<void> {
  if (window.docsearch) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[data-dahlia-docsearch-js="${src}"]`);

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Unable to load DocSearch JS: ${src}`)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.dahliaDocsearchJs = src;
    script.src = src;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Unable to load DocSearch JS: ${src}`)), { once: true });
    document.head.append(script);
  });
}

function injectThemeStyles(): void {
  if (document.querySelector('[data-dahlia-docsearch-theme]')) {
    return;
  }

  const style = document.createElement('style');
  style.dataset.dahliaDocsearchTheme = '';
  style.textContent = `
    :root {
      --docsearch-primary-color: var(--dahlia-accent);
      --docsearch-text-color: var(--dahlia-text);
      --docsearch-muted-color: var(--dahlia-text-muted);
      --docsearch-container-background: rgb(0 0 0 / 35%);
      --docsearch-modal-background: var(--dahlia-background);
      --docsearch-searchbox-background: var(--dahlia-surface);
      --docsearch-searchbox-focus-background: var(--dahlia-background);
      --docsearch-hit-color: var(--dahlia-text);
      --docsearch-hit-active-color: var(--dahlia-accent-contrast);
      --docsearch-hit-background: var(--dahlia-surface);
      --docsearch-footer-background: var(--dahlia-background);
      --docsearch-key-gradient: none;
      --docsearch-key-shadow: none;
      --docsearch-modal-shadow: 0 24px 80px rgb(0 0 0 / 18%);
      --docsearch-modal-width: min(42rem, calc(100vw - 2rem));
      --docsearch-modal-height: min(38rem, calc(100dvh - 4rem));
    }

    .DocSearch-Button {
      display: none;
    }

    .DocSearch-Modal {
      border: 1px solid var(--dahlia-border-muted);
      border-radius: min(var(--dahlia-radius-lg), 1rem);
    }

    .DocSearch-SearchBar,
    .DocSearch-Footer {
      border-color: var(--dahlia-border-subtle);
    }

    .DocSearch-Hit a {
      border-radius: min(var(--dahlia-radius-md), 0.75rem);
    }
  `;
  document.head.append(style);
}

async function initDocSearch(): Promise<void> {
  const container = document.querySelector<HTMLElement>('[data-dahlia-docsearch]');
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-dahlia-search-trigger]'));

  if (!container || !triggers.length) {
    return;
  }

  const appId = container.dataset.dahliaDocsearchAppId;
  const apiKey = container.dataset.dahliaDocsearchApiKey;
  const indexName = container.dataset.dahliaDocsearchIndexName;

  if (!appId || !apiKey || !indexName) {
    return;
  }

  await loadStylesheet(container.dataset.dahliaDocsearchCssUrl || defaultCssUrl);
  injectThemeStyles();
  await loadScript(container.dataset.dahliaDocsearchJsUrl || defaultJsUrl);

  if (!window.docsearch) {
    return;
  }

  const instance = window.docsearch({
    container,
    appId,
    apiKey,
    indexName,
    askAi: container.dataset.dahliaDocsearchAskAi || undefined,
    disableUserPersonalization: getOptionalBoolean(container, 'dahliaDocsearchDisableUserPersonalization'),
    insights: getOptionalBoolean(container, 'dahliaDocsearchInsights'),
    keyboardShortcuts: {
      'Ctrl/Cmd+K': true,
      '/': false,
    },
    maxResultsPerGroup: getOptionalNumber(container, 'dahliaDocsearchMaxResultsPerGroup'),
    placeholder: container.dataset.dahliaDocsearchPlaceholder,
    searchParameters: getSearchParameters(container),
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      instance.open();
    });
  });
}

if (!window.__dahliaDocSearchReady) {
  window.__dahliaDocSearchReady = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      void initDocSearch();
    }, { once: true });
  } else {
    void initDocSearch();
  }
}
