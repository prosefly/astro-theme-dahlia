let dahliaDropdownContentId = 0;

function initDahliaDropdowns(): void {
  document.querySelectorAll('[data-dahlia-dropdown]').forEach((details) => {
    if (!(details instanceof HTMLDetailsElement) || details.dataset.dahliaDropdownReady) {
      return;
    }

    details.dataset.dahliaDropdownReady = 'true';
    const summary = details.querySelector('summary');
    const content = details.querySelector<HTMLElement>('[data-dahlia-dropdown-content]');

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

    details.addEventListener('toggle', () => {
      syncExpanded();

      if (!details.open) {
        return;
      }

      document.querySelectorAll('[data-dahlia-dropdown][open]').forEach((otherDetails) => {
        if (otherDetails !== details && otherDetails instanceof HTMLDetailsElement) {
          otherDetails.open = false;
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!details.open || !(event.target instanceof Node) || details.contains(event.target)) {
        return;
      }

      details.open = false;
    });

    details.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }

      details.open = false;
      details.querySelector('summary')?.focus();
    });

    details.querySelectorAll('[data-dahlia-dropdown-close]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        details.open = false;
      });
    });
  });
}

initDahliaDropdowns();
document.addEventListener('astro:page-load', initDahliaDropdowns);
