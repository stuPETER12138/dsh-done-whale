import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStatusTracker } from '../src/status.mjs';
import { colorsOf } from '../src/shared.mjs';
import { iconUri, whaleSvg } from '../src/favicon.mjs';

const row = (id, extra = {}) => ({ id, running: false, ...extra });
const state = (rows, current = 'a') => ({ byId: Object.fromEntries(rows.map(r => [r.id, r])), current });
const empty = new Map();

test('official signals: green wins; pending comes from uiSession map', () => {
  const track = createStatusTracker();
  assert.equal(track(state([row('a')]), empty, true), 'black');
  const pending = new Map([['a', { kind: 'approval' }]]);
  assert.equal(track(state([row('a')]), pending, true), 'amber');
  assert.equal(track(state([row('a'), row('b', { completed: true })]), pending, true), 'green');
  assert.equal(track(state([row('a')]), empty, true), 'black');
});

test('subagents and stale pending IDs do not affect status', () => {
  assert.equal(createStatusTracker()(state([row('a'), row('child', { origin: 'subagent', completed: true })]),
    new Map([['child', {}], ['removed', {}]]), true), 'black');
});

test('hidden selected completion clears only when that session is viewed', () => {
  const track = createStatusTracker();
  track(state([row('a', { running: true }), row('b')]), empty, false);
  assert.equal(track(state([row('a'), row('b')]), empty, false), 'green');
  assert.equal(track(state([row('a'), row('b')], 'b'), empty, true), 'green');
  assert.equal(track(state([row('a'), row('b')]), empty, true), 'black');
});

test('initial idle, foreground finish and hidden unselected finish do not invent reminders', () => {
  for (const visible of [true, false]) {
    const track = createStatusTracker();
    assert.equal(track(state([row('a')]), empty, visible), 'black');
    track(state([row('a', { running: true })]), empty, visible);
    assert.equal(track(state([row('a')], visible ? 'a' : 'b'), empty, visible), 'black');
  }
});

test('rerun and removal forget hidden reminders', () => {
  for (const remove of [true, false]) {
    const track = createStatusTracker();
    track(state([row('a', { running: true })]), empty, false);
    track(state([row('a')]), empty, false);
    assert.equal(track(state(remove ? [] : [row('a', { running: true })]), empty, false), 'black');
    if (remove) assert.equal(track(state([row('a')]), empty, false), 'black');
  }
});

test('validated colors and original whale SVG', () => {
  assert.deepEqual(colorsOf(), { green: '#22C55E', amber: '#F59E0B', black: undefined });
  assert.deepEqual(colorsOf({ green: 'bad', amber: '#abcdef', black: '#010203' }),
    { green: '#22C55E', amber: '#abcdef', black: '#010203' });
  assert.match(whaleSvg('#abcdef'), /#abcdef/);
  assert.match(iconUri('#abcdef'), /^data:image\/svg\+xml,%3Csvg/);
  assert.throws(() => whaleSvg('" onload="x'), TypeError);
});
