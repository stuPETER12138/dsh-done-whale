import { SETTINGS_NAMESPACE, colorsOf } from './shared.mjs';
import { createStatusTracker } from './status.mjs';
import { iconUri } from './favicon.mjs';
import { messages, WhaleSettingsSection } from './settings.mjs';

export const inject = ['sessions', 'uiSession', 'slots', 'locale', 'settingsScope'];

export function apply(ctx) {
  const scope = ctx.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
  const list = ctx.sessions.list;
  const pending = ctx.uiSession.pendingInteractions;
  const status = createStatusTracker();
  ctx.effect(() => {
    const existing = document.head.querySelector('link[rel~="icon"]');
    const link = existing ?? document.createElement('link');
    const original = link.getAttribute('href');
    const originalType = link.getAttribute('type');
    if (!existing) {
      link.rel = 'icon';
      document.head.append(link);
    }
    let applied;
    const restore = () => {
      if (original === null) link.removeAttribute('href');
      else link.setAttribute('href', original);
      if (originalType === null) link.removeAttribute('type');
      else link.setAttribute('type', originalType);
    };
    const sync = () => {
      const key = status(list.getSnapshot(), pending.getSnapshot(), document.visibilityState === 'visible');
      const color = colorsOf(scope.getSnapshot().value)[key];
      if (color === applied) return;
      if (color) {
        link.setAttribute('href', iconUri(color));
        link.setAttribute('type', 'image/svg+xml');
      } else restore();
      applied = color;
    };
    const stops = [];
    const cleanup = () => {
      stops.forEach(stop => stop());
      document.removeEventListener('visibilitychange', sync);
      if (existing) restore();
      else link.remove();
    };
    try {
      stops.push(list.subscribe(sync));
      stops.push(pending.subscribe(sync));
      stops.push(scope.subscribe(sync));
      document.addEventListener('visibilitychange', sync);
      sync();
    } catch (error) {
      cleanup();
      throw error;
    }
    return cleanup;
  });
  ctx.effect(() => ctx.locale.register(SETTINGS_NAMESPACE, messages));
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: SETTINGS_NAMESPACE, order: 100,
    label: () => ctx.locale.bind(SETTINGS_NAMESPACE)('nav'),
    locale: SETTINGS_NAMESPACE, inject: () => ({ scope }),
  }, WhaleSettingsSection));
}
