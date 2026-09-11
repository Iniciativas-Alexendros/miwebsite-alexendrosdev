import { CAL_BRAND, CAL_EMBED_SCRIPT, CAL_ORIGIN } from './calBooking';

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalFn>;
  q?: unknown[];
};

let initQueued = false;
let scriptPromise: Promise<void> | undefined;

function getCal(): CalFn | undefined {
  return window.Cal as CalFn | undefined;
}

function ensureQueueStub(): CalFn {
  const existing = getCal();
  if (existing) return existing;

  const cal = ((...args: unknown[]) => {
    (cal.q ||= []).push(args);
  }) as CalFn;
  cal.q = [];
  cal.ns = {};
  window.Cal = cal;
  return cal;
}

function loadEmbedScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${CAL_EMBED_SCRIPT}"]`);
  if (existing) {
    scriptPromise = new Promise((resolve, reject) => {
      if (getCal()?.loaded || existing.getAttribute('data-cal-ready') === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Cal embed')), { once: true });
    });
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = CAL_EMBED_SCRIPT;
    script.async = true;
    script.addEventListener('load', () => {
      script.setAttribute('data-cal-ready', 'true');
      resolve();
    });
    script.addEventListener('error', () => reject(new Error('Cal embed')));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

function queueInit(cal: CalFn): void {
  if (initQueued) return;
  cal('init', { origin: CAL_ORIGIN });
  cal('ui', {
    theme: 'dark',
    hideEventTypeDetails: false,
    cssVarsPerTheme: {
      dark: { 'cal-brand': CAL_BRAND },
      light: { 'cal-brand': CAL_BRAND }
    }
  });
  initQueued = true;
}

async function prepareCal(calLink?: string): Promise<CalFn> {
  const cal = ensureQueueStub();
  queueInit(cal);
  if (calLink) cal('preload', { calLink });
  await loadEmbedScript();
  return getCal() ?? cal;
}

async function openCalModal(calLink: string): Promise<void> {
  const cal = await prepareCal(calLink);
  cal('modal', {
    calLink,
    config: { layout: 'month_view', theme: 'dark' }
  });
}

function isModifiedClick(event: MouseEvent): boolean {
  return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function setupCalBookingTriggers(): void {
  document.addEventListener(
    'click',
    (event) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-cal-link]');
      if (!trigger) return;
      if (event.defaultPrevented || isModifiedClick(event)) return;
      const calLink = trigger.getAttribute('data-cal-link');
      if (!calLink) return;
      event.preventDefault();
      event.stopPropagation();
      const href = trigger instanceof HTMLAnchorElement ? trigger.href : '';
      void openCalModal(calLink).catch(() => {
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
      });
    },
    true
  );

  for (const el of document.querySelectorAll<HTMLElement>('[data-cal-link]')) {
    const preload = () => {
      const calLink = el.getAttribute('data-cal-link') ?? undefined;
      void prepareCal(calLink).catch(() => {
        /* el clic sigue teniendo fallback al URL canónico */
      });
    };
    el.addEventListener('pointerenter', preload, { once: true });
    el.addEventListener('focus', preload, { once: true });
  }
}

declare global {
  interface Window {
    Cal?: CalFn;
  }
}
