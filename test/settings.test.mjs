import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { create, act } from 'react-test-renderer';
import { WhaleSettingsSection } from '../src/settings.mjs';

test('settings validate hex, handle failed writes, reset and disable read-only controls', async () => {
  const calls = [];
  const listeners = new Set();
  let snapshot = { value: {}, writable: true };
  let fail = false;
  const scope = {
    getSnapshot() { return snapshot; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    async set(key, value) { calls.push(['set', key, value]); if (fail) throw new Error('offline'); },
    async unset(key) { calls.push(['unset', key]); },
  };
  let renderer;
  await act(async () => { renderer = create(createElement(WhaleSettingsSection, { scope, t: key => key })); });
  const text = () => renderer.root.findAllByType('input').find(input => input.props.type === 'text');
  await act(async () => { text().props.onChange({ target: { value: '#bad' } }); });
  await act(async () => { text().props.onBlur(); });
  assert.equal(calls.length, 0);
  assert.equal(text().props['aria-invalid'], true);
  const picker = renderer.root.findAllByType('input')[0];
  assert.equal(picker.props.value, '#22C55E');
  await act(async () => { text().props.onChange({ target: { value: '#abcdef' } }); });
  fail = true;
  await act(async () => { text().props.onBlur(); });
  assert.deepEqual(calls[0], ['set', 'green', '#abcdef']);
  assert.ok(renderer.root.findAllByType('small').some(node => node.children.includes('failed')));
  fail = false;
  // Official scopes can resolve after a rejected write and recovery read.
  await act(async () => { text().props.onBlur(); });
  assert.equal(text().props.value, '#abcdef');
  assert.ok(renderer.root.findAllByType('small').some(node => node.children.includes('failed')));
  await act(async () => { renderer.root.findAllByType('button')[0].props.onClick(); });
  assert.deepEqual(calls[2], ['unset', 'green']);
  assert.equal(text().props.value, '#22C55E');
  await act(async () => { snapshot = { value: { green: '#123456' }, writable: false }; listeners.forEach(fn => fn()); });
  assert.equal(text().props.value, '#123456');
  assert.ok(renderer.root.findAllByType('input').every(node => node.props.disabled));
  await act(async () => renderer.unmount());
  assert.equal(listeners.size, 0);
});
