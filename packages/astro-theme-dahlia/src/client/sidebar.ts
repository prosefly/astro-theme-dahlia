export {};

const prosefly = window.__prosefly ??= {};
const proseflyDahlia = (prosefly.dahlia ??= {});

function initDahliaSidebarScroll(): (() => void) | undefined {
  const containers = Array.from(document.querySelectorAll('[data-sidebar-scroll]'));
  const cleanupCallbacks: Array<() => void> = [];

  for (const container of containers) {
    if (!(container instanceof HTMLElement) || container.dataset.sidebarReady) {
      continue;
    }

    const scrollArea = container.querySelector<HTMLElement>('[data-sidebar-scroll-area]');
    const topFade = container.querySelector<HTMLElement>('[data-sidebar-fade-top]');
    const bottomFade = container.querySelector<HTMLElement>('[data-sidebar-fade-bottom]');

    if (!scrollArea || !topFade || !bottomFade) {
      continue;
    }

    container.dataset.sidebarReady = 'true';

    const updateFades = () => {
      const overflow = scrollArea.scrollHeight > scrollArea.clientHeight + 1;
      const atTop = scrollArea.scrollTop <= 1;
      const atBottom =
        scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 1;

      topFade.toggleAttribute('data-visible', overflow && !atTop);
      bottomFade.toggleAttribute('data-visible', overflow && !atBottom);
    };

    scrollArea.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);
    cleanupCallbacks.push(() => {
      scrollArea.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
      delete container.dataset.sidebarReady;
    });
    updateFades();
  }

  return cleanupCallbacks.length ? () => cleanupCallbacks.forEach((cleanup) => cleanup()) : undefined;
}

let cleanupDahliaSidebarScroll: (() => void) | undefined;

const initializeDahliaSidebarScroll = () => {
  cleanupDahliaSidebarScroll?.();
  cleanupDahliaSidebarScroll = initDahliaSidebarScroll();
};

proseflyDahlia.initSidebarScroll = initializeDahliaSidebarScroll;

document.addEventListener('astro:before-swap', () => {
  cleanupDahliaSidebarScroll?.();
  cleanupDahliaSidebarScroll = undefined;
});
document.addEventListener('astro:page-load', () => {
  proseflyDahlia.initSidebarScroll?.();
});
proseflyDahlia.initSidebarScroll?.();
