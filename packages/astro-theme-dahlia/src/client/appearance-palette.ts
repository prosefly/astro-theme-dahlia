import { getCustomAccentVariables } from '../lib/colors';

const appearanceStorageKeys = {
  accent: 'dahlia-preview-accent',
  gray: 'dahlia-preview-gray',
  radius: 'dahlia-preview-radius',
} as const;

type AppearanceKey = keyof typeof appearanceStorageKeys;
type InitialAppearance = {
  accent: string;
  gray: string;
  radius: string;
  accentLight: string;
  accentDark: string;
};

declare global {
  interface Window {
    __dahliaAppearanceInitial?: InitialAppearance;
  }
}

const hexColorPattern = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;

function getAppearanceRoot(): HTMLElement {
  return document.documentElement;
}

function getInitialAppearance(): InitialAppearance {
  if (!window.__dahliaAppearanceInitial) {
    const root = getAppearanceRoot();

    window.__dahliaAppearanceInitial = {
      accent: root.dataset.accent ?? '',
      gray: root.dataset.gray ?? '',
      radius: root.dataset.radius ?? '',
      accentLight: root.style.getPropertyValue('--dahlia-accent-light'),
      accentDark: root.style.getPropertyValue('--dahlia-accent-dark'),
    };
  }

  return window.__dahliaAppearanceInitial;
}

function setAppearanceValue(key: AppearanceKey, value: string): void {
  const root = getAppearanceRoot();

  if (key === 'accent') {
    if (hexColorPattern.test(value)) {
      const customAccent = getCustomAccentVariables(value);

      delete root.dataset.accent;
      root.dataset.customAccent = value;
      for (const [name, color] of Object.entries(customAccent)) {
        root.style.setProperty(name, color);
      }
    } else {
      root.dataset.accent = value;
      delete root.dataset.customAccent;
      root.style.removeProperty('--dahlia-accent-light');
      root.style.removeProperty('--dahlia-accent-dark');
    }
  } else {
    root.dataset[key] = value;
  }

  window.localStorage.setItem(appearanceStorageKeys[key], value);
}

function getCurrentAppearance() {
  const root = getAppearanceRoot();
  const initialAppearance = getInitialAppearance();

  return {
    accent: root.dataset.customAccent || root.dataset.accent || initialAppearance.accent || 'indigo',
    gray: root.dataset.gray || initialAppearance.gray || 'neutral',
    radius: root.dataset.radius || initialAppearance.radius || 'medium',
  };
}

function updateAppearanceButtons(root: ParentNode = document): void {
  const html = getAppearanceRoot();

  root.querySelectorAll('[data-appearance-key][data-appearance-value]').forEach((button) => {
    if (!(button instanceof HTMLElement)) {
      return;
    }

    const key = button.dataset.appearanceKey as AppearanceKey | undefined;
    const value = button.dataset.appearanceValue;

    if (!key || !value) {
      return;
    }

    button.toggleAttribute('data-active', html.dataset[key] === value);
  });

  root.querySelectorAll('[data-appearance-custom-accent]').forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (html.dataset.customAccent && hexColorPattern.test(html.dataset.customAccent)) {
      input.value = html.dataset.customAccent;
    }

    input.toggleAttribute('data-active', Boolean(html.dataset.customAccent));
  });
}

function emitAppearanceChange(): void {
  document.dispatchEvent(
    new CustomEvent('dahlia:appearance-change', {
      detail: getCurrentAppearance(),
    }),
  );
}

function updateAllAppearancePalettes(): void {
  document.querySelectorAll('[data-appearance-palette]').forEach((palette) => {
    updateAppearanceButtons(palette);
  });
  emitAppearanceChange();
}

function restoreInitialAppearance(): void {
  const root = getAppearanceRoot();
  const initialAppearance = getInitialAppearance();

  if (initialAppearance.accent) {
    root.dataset.accent = initialAppearance.accent;
  } else {
    delete root.dataset.accent;
  }

  delete root.dataset.customAccent;
  root.dataset.gray = initialAppearance.gray || 'neutral';
  root.dataset.radius = initialAppearance.radius || 'medium';

  if (initialAppearance.accentLight) {
    root.style.setProperty('--dahlia-accent-light', initialAppearance.accentLight);
  } else {
    root.style.removeProperty('--dahlia-accent-light');
  }

  if (initialAppearance.accentDark) {
    root.style.setProperty('--dahlia-accent-dark', initialAppearance.accentDark);
  } else {
    root.style.removeProperty('--dahlia-accent-dark');
  }

  Object.values(appearanceStorageKeys).forEach((storageKey) => {
    window.localStorage.removeItem(storageKey);
  });
}

function applySavedAppearance(): void {
  (Object.keys(appearanceStorageKeys) as AppearanceKey[]).forEach((key) => {
    const value = window.localStorage.getItem(appearanceStorageKeys[key]);

    if (value) {
      setAppearanceValue(key, value);
    }
  });
}

function initDahliaAppearancePalette(): void {
  getInitialAppearance();
  applySavedAppearance();
  emitAppearanceChange();

  document.querySelectorAll('[data-appearance-palette]').forEach((palette) => {
    if (!(palette instanceof HTMLElement) || palette.dataset.appearancePaletteReady) {
      updateAppearanceButtons(palette);
      return;
    }

    palette.dataset.appearancePaletteReady = 'true';
    updateAppearanceButtons(palette);

    palette.querySelectorAll('[data-appearance-key][data-appearance-value]').forEach((button) => {
      button.addEventListener('click', () => {
        if (!(button instanceof HTMLElement)) {
          return;
        }

        const key = button.dataset.appearanceKey as AppearanceKey | undefined;
        const value = button.dataset.appearanceValue;

        if (!key || !value) {
          return;
        }

        setAppearanceValue(key, value);
        updateAllAppearancePalettes();
      });
    });

    palette.querySelectorAll('[data-appearance-custom-accent]').forEach((input) => {
      input.addEventListener('input', () => {
        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        setAppearanceValue('accent', input.value);
        updateAllAppearancePalettes();
      });
    });

    palette.querySelector('[data-appearance-reset]')?.addEventListener('click', () => {
      restoreInitialAppearance();
      updateAllAppearancePalettes();
    });
  });
}

initDahliaAppearancePalette();
document.addEventListener('astro:page-load', initDahliaAppearancePalette);
