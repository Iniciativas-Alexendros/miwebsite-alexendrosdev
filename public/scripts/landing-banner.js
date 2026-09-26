/**
 * Landing Banner Client Script
 * Handles show/hide/dismiss logic for the "Landing en 10 días" sticky banner
 */

const STORAGE_KEY = 'alexendros.banner.landing-10-dias.v1';

/** @type {HTMLDivElement | null} */
let banner = null;
/** @type {HTMLButtonElement | null} */
let dismissBtn = null;
/** @type {HTMLAnchorElement | null} */
let ctaBtn = null;
/** @type {HTMLElement} */
const htmlEl = document.documentElement;

/**
 * @returns {{ track: (event: string, data?: object) => void } | undefined}
 */
function getVa() {
  /** @type {Window & { va?: { track: (event: string, data?: object) => void } }} */
  const w = window;
  return w.va;
}

function isDismissed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function setDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

function updateBodyPadding() {
  if (!banner) return;
  const height = banner.offsetHeight;
  if (htmlEl.classList.contains('banner-visible')) {
    htmlEl.style.setProperty('--banner-height', `${height}px`);
  } else {
    htmlEl.style.removeProperty('--banner-height');
  }
}

function showBanner() {
  if (isDismissed()) return;
  banner?.classList.remove('hidden');
  banner?.classList.add('visible');
  htmlEl.classList.add('banner-visible');
  updateBodyPadding();

  // Track impression
  const va = getVa();
  if (va) {
    va.track('banner_landing10_impression', {});
  }
}

function hideBanner() {
  banner?.classList.add('hidden');
  banner?.classList.remove('visible');
  htmlEl.classList.remove('banner-visible');
  updateBodyPadding();
  setDismissed();

  // Track dismiss
  const vaDismiss = getVa();
  if (vaDismiss) {
    vaDismiss.track('banner_landing10_dismiss', {});
  }
}

// Track CTA click
function trackCtaClick() {
  const vaCta = getVa();
  if (vaCta) {
    vaCta.track('banner_landing10_cta_click', {});
  }
}

// Dismiss handler
function onDismissClick() {
  hideBanner();
}

// Initialize when DOM is ready
function init() {
  banner = document.getElementById('landing-banner');
  dismissBtn = document.getElementById('landing-banner-dismiss');
  ctaBtn = document.getElementById('landing-banner-cta');

  if (!banner) return;

  // Track CTA click
  ctaBtn?.addEventListener('click', trackCtaClick);

  // Dismiss handler
  dismissBtn?.addEventListener('click', onDismissClick);

  // Show immediately (promotional tool)
  showBanner();

  // Recalculate padding on resize
  window.addEventListener('resize', updateBodyPadding);

  // Respect prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    banner?.classList.add('reduce-motion');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
