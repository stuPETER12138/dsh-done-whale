import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';

function store(value) {
  const listeners = new Set();
  return { getSnapshot: () => value, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    set(next) { value = next; listeners.forEach(fn => fn()); }, listeners };
}
function fixture(existing = true) {
  const attrs = new Map([['href', '/custom.ico'], ['type', 'image/x-icon']]);
  let removed = false;
  const link = { getAttribute: key => attrs.get(key) ?? null, setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: k => attrs.delete(k), remove: () => { removed = true; } };
  const events = new Map();
  const document = { visibilityState: 'visible', head: { querySelector: () => existing ? link : null, append() {} },
    createElement: () => link, addEventListener: (k, fn) => events.set(k, fn), removeEventListener: k => events.delete(k) };
  let plugin;
  runInNewContext(readFileSync('lib/client.cjs', 'utf8'), { document,
    window: { __ModuleLoader__: { load: ({ factory }) => { plugin = factory(createRequire(import.meta.url)); } } } });
  const list = store({ current: 'a', byId: { a: { id: 'a', running: false } } });
  const pending = store(new Map());
  const scope = store({ value: {} });
  const disposers = [];
  const ctx = { sessions: { list }, uiSession: { pendingInteractions: pending }, settingsScope: { bind: () => scope },
    effect(fn) { disposers.push(fn()); }, locale: { register: () => () => {}, bind: () => key => key },
    slots: { inject: (_key, fn) => disposers.push(fn()), register: () => () => {} } };
  plugin.apply(ctx);
  return { attrs, list, pending, scope, events, document, removed: () => removed,
    dispose: () => disposers.reverse().forEach(fn => fn()) };
}

test('built client subscribes to new pending source, applies colors and restores exact icon', () => {
  const f = fixture();
  assert.equal(f.attrs.get('href'), '/custom.ico');
  f.pending.set(new Map([['a', { kind: 'approval' }]]));
  assert.match(decodeURIComponent(f.attrs.get('href')), /#F59E0B/);
  assert.equal(f.attrs.get('type'), 'image/svg+xml');
  f.scope.set({ value: { amber: '#123456' } });
  assert.match(decodeURIComponent(f.attrs.get('href')), /#123456/);
  f.pending.set(new Map());
  assert.equal(f.attrs.get('href'), '/custom.ico');
  f.scope.set({ value: { black: '#445566' } });
  assert.match(decodeURIComponent(f.attrs.get('href')), /#445566/);
  f.dispose();
  assert.equal(f.attrs.get('href'), '/custom.ico');
  assert.equal(f.attrs.get('type'), 'image/x-icon');
  for (const source of [f.list, f.pending, f.scope]) assert.equal(source.listeners.size, 0);
  assert.equal(f.events.size, 0);
});

test('visibility listener acknowledges hidden selected completion', () => {
  const f = fixture();
  f.document.visibilityState = 'hidden';
  f.list.set({ current: 'a', byId: { a: { id: 'a', running: true } } });
  f.list.set({ current: 'a', byId: { a: { id: 'a', running: false } } });
  assert.match(decodeURIComponent(f.attrs.get('href')), /#22C55E/);
  f.document.visibilityState = 'visible';
  f.events.get('visibilitychange')();
  assert.equal(f.attrs.get('href'), '/custom.ico');
  f.dispose();
});

test('created icon is removed on teardown', () => {
  const f = fixture(false);
  f.dispose();
  assert.equal(f.removed(), true);
});
