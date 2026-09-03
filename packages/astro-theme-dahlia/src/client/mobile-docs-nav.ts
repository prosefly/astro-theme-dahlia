export {};

const prosefly = window.__prosefly ??= {};
const proseflyDahlia = (prosefly.dahlia ??= {});

function initMobileDocsNav(): (() => void) | undefined {
  const drawer = document.querySelector<HTMLElement>('[data-mobile-sidebar]');
  const openButtons = Array.from(document.querySelectorAll('[data-mobile-sidebar-open]'));
  const closeButtons = drawer
    ? Array.from(drawer.querySelectorAll('[data-mobile-sidebar-close]'))
    : [];
  const sectionSwitch = document.querySelector<HTMLDetailsElement>('[data-section-switch]');
  const sectionOptions = Array.from(document.querySelectorAll<HTMLElement>('[data-section-option]'));
  const sectionPanels = Array.from(document.querySelectorAll<HTMLElement>('[data-section-panel]'));
  const summaryLabel = document.querySelector('[data-section-summary-label]');
  const summaryCount = document.querySelector('[data-section-summary-count]');
  const summaryIcons = Array.from(document.querySelectorAll<HTMLElement>('[data-section-summary-icon]'));

  if (!drawer || !openButtons.length || drawer.dataset.mobileDocsNavReady) {
    return;
  }

  drawer.dataset.mobileDocsNavReady = 'true';
  const cleanupCallbacks: Array<() => void> = [];
  const addListener = (
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, listener, options);
    cleanupCallbacks.push(() => target.removeEventListener(type, listener, options));
  };

  let closeTimer: number | undefined;
  let previousOverflow: string | undefined;
  let previousFocus: HTMLElement | null = null;

  const getFocusableElements = () => Array.from(
    drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('hidden') && !element.closest('[hidden]'));

  const setOpenButtonState = (open: boolean) => {
    openButtons.forEach((button) => {
      button.setAttribute('aria-expanded', String(open));
    });
  };

  const openDrawer = () => {
    window.clearTimeout(closeTimer);
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawer.hidden = false;
    drawer.removeAttribute('inert');
    setOpenButtonState(true);
    previousOverflow ??= document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      drawer.setAttribute('data-open', '');
      getFocusableElements()[0]?.focus({ preventScroll: true });
    });
  };

  const closeDrawer = () => {
    if (drawer.hidden) {
      return;
    }

    drawer.removeAttribute('data-open');
    if (previousOverflow !== undefined) {
      document.documentElement.style.overflow = previousOverflow;
      previousOverflow = undefined;
    }
    setOpenButtonState(false);
    previousFocus?.focus({ preventScroll: true });
    drawer.setAttribute('inert', '');
    closeTimer = window.setTimeout(() => {
      drawer.hidden = true;
    }, 180);
  };

  openButtons.forEach((button) => addListener(button, 'click', openDrawer));
  closeButtons.forEach((button) => addListener(button, 'click', closeDrawer));
  drawer.querySelectorAll('a').forEach((link) => addListener(link, 'click', closeDrawer));

  sectionOptions.forEach((option) => {
    const handleSectionOptionClick = () => {
      const slug = option.getAttribute('data-section-option');

      if (!slug) {
        return;
      }

      sectionOptions.forEach((item) => {
        const active = item.getAttribute('data-section-option') === slug;
        item.toggleAttribute('data-active', active);

        if (active) {
          item.setAttribute('aria-current', 'page');
        } else {
          item.removeAttribute('aria-current');
        }
      });

      sectionPanels.forEach((panel) => {
        panel.hidden = panel.getAttribute('data-section-panel') !== slug;
      });
      window.dispatchEvent(new Event('resize'));

      summaryIcons.forEach((icon) => {
        icon.hidden = icon.getAttribute('data-section-summary-icon') !== slug;
      });

      if (summaryLabel) {
        summaryLabel.textContent = option.getAttribute('data-section-label') ?? '';
      }

      if (summaryCount) {
        summaryCount.textContent = option.getAttribute('data-section-count') ?? '';
      }

      sectionSwitch?.removeAttribute('open');
    };

    addListener(option, 'click', handleSectionOptionClick);
  });

  const handleKeydown = (event: KeyboardEvent) => {
    if (drawer.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (!first || !last) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  addListener(window, 'keydown', handleKeydown as EventListener);

  return () => {
    window.clearTimeout(closeTimer);
    if (previousOverflow !== undefined) {
      document.documentElement.style.overflow = previousOverflow;
    }
    cleanupCallbacks.forEach((cleanup) => cleanup());
    delete drawer.dataset.mobileDocsNavReady;
  };
}

let cleanupMobileDocsNav: (() => void) | undefined;

const initializeMobileDocsNav = () => {
  cleanupMobileDocsNav?.();
  cleanupMobileDocsNav = initMobileDocsNav();
};

proseflyDahlia.initMobileDocsNav = initializeMobileDocsNav;

document.addEventListener('astro:before-swap', () => {
  cleanupMobileDocsNav?.();
  cleanupMobileDocsNav = undefined;
});
document.addEventListener('astro:page-load', () => {
  proseflyDahlia.initMobileDocsNav?.();
});
proseflyDahlia.initMobileDocsNav?.();
