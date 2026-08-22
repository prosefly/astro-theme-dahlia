declare global {
  interface Window {
    __dahliaThemeModeControlReady?: boolean;
  }
}

export {};

const storageKey = 'dahlia-theme';
const root = document.documentElement;
const modes = ['system', 'light', 'dark'] as const;

type ThemeMode = typeof modes[number];

function isThemeMode(mode: string | undefined | null): mode is ThemeMode {
  return modes.includes(mode as ThemeMode);
}

function initThemeModeControls(): void {
  const controls = Array.from(document.querySelectorAll<HTMLElement>('[data-theme-switch]'));

  if (!controls.length) {
    return;
  }

  const setTheme = (mode: string | undefined | null) => {
    const nextMode = isThemeMode(mode) ? mode : 'system';
    root.dataset.theme = nextMode;

    if (nextMode === 'system') {
      window.localStorage.removeItem(storageKey);
    } else {
      window.localStorage.setItem(storageKey, nextMode);
    }

    controls.forEach((controlGroup) => {
      controlGroup.querySelectorAll('[data-theme-mode]').forEach((control) => {
        const active = control.getAttribute('data-theme-mode') === nextMode;
        control.setAttribute('aria-pressed', active ? 'true' : 'false');
        control.toggleAttribute('data-active', active);
      });
    });
  };

  const savedTheme = window.localStorage.getItem(storageKey);
  setTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : root.dataset.theme || 'system');

  controls.forEach((controlGroup) => {
    if (controlGroup.dataset.themeModeControlReady) {
      return;
    }

    controlGroup.dataset.themeModeControlReady = 'true';

    controlGroup.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const button = event.target.closest('[data-theme-mode]');

      if (button) {
        setTheme(button.getAttribute('data-theme-mode'));
      }
    });
  });
}

if (!window.__dahliaThemeModeControlReady) {
  window.__dahliaThemeModeControlReady = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeModeControls, { once: true });
  } else {
    initThemeModeControls();
  }

  document.addEventListener('astro:page-load', initThemeModeControls);
}
