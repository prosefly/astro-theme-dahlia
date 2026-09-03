export {};

const prosefly = window.__prosefly ??= {};
const proseflyDahlia = (prosefly.dahlia ??= {});

let dahliaDropdownContentId = 0;

function initDahliaDropdowns(): (() => void) | undefined {
  const cleanupCallbacks: Array<() => void> = [];
  const initializedDetails: HTMLDetailsElement[] = [];

  document.querySelectorAll('[data-dropdown]').forEach((details) => {
    if (!(details instanceof HTMLDetailsElement) || details.dataset.dropdownReady) {
      return;
    }

    initializedDetails.push(details);
    details.dataset.dropdownReady = 'true';
    const summary = details.querySelector('summary');
    const content = details.querySelector<HTMLElement>('[data-dropdown-content]');

    if (summary && content) {
      if (!content.id) {
        dahliaDropdownContentId += 1;
        content.id = `dahlia-dropdown-content-${dahliaDropdownContentId}`;
      }

      summary.setAttribute('aria-controls', content.id);
    }

    const syncExpanded = () => {
      summary?.setAttribute('aria-expanded', String(details.open));
    };

    syncExpanded();

    const handleToggle = () => {
      syncExpanded();

      if (!details.open) {
        return;
      }

      document.querySelectorAll('[data-dropdown][open]').forEach((otherDetails) => {
        if (otherDetails !== details && otherDetails instanceof HTMLDetailsElement) {
          otherDetails.open = false;
        }
      });
    };
    details.addEventListener('toggle', handleToggle);
    cleanupCallbacks.push(() => details.removeEventListener('toggle', handleToggle));

    const handleDocumentClick = (event: MouseEvent) => {
      if (!details.open || !(event.target instanceof Node) || details.contains(event.target)) {
        return;
      }

      details.open = false;
    };
    document.addEventListener('click', handleDocumentClick);
    cleanupCallbacks.push(() => document.removeEventListener('click', handleDocumentClick));

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      details.open = false;
      details.querySelector('summary')?.focus();
    };
    details.addEventListener('keydown', handleKeydown);
    cleanupCallbacks.push(() => details.removeEventListener('keydown', handleKeydown));

    details.querySelectorAll('[data-dropdown-close]').forEach((trigger) => {
      const handleCloseClick = () => {
        details.open = false;
      };
      trigger.addEventListener('click', handleCloseClick);
      cleanupCallbacks.push(() => trigger.removeEventListener('click', handleCloseClick));
    });
  });

  return cleanupCallbacks.length ? () => {
    cleanupCallbacks.forEach((cleanup) => cleanup());
    initializedDetails.forEach((details) => delete details.dataset.dropdownReady);
  } : undefined;
}

let cleanupDahliaDropdowns: (() => void) | undefined;

const initializeDahliaDropdowns = () => {
  cleanupDahliaDropdowns?.();
  cleanupDahliaDropdowns = initDahliaDropdowns();
};

proseflyDahlia.initDropdowns = initializeDahliaDropdowns;

document.addEventListener('astro:before-swap', () => {
  cleanupDahliaDropdowns?.();
  cleanupDahliaDropdowns = undefined;
});
document.addEventListener('astro:page-load', () => {
  proseflyDahlia.initDropdowns?.();
});
proseflyDahlia.initDropdowns?.();
