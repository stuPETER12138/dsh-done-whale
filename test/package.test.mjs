import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import plugin, { WhaleSettingsSchema } from '../lib/index.mjs';

test('built host registers a string namespace without removed runtime exports', () => {
  assert.deepEqual(plugin.inject, ['settings']);
  let registration;
  plugin.apply({ settings: { register: (...args) => { registration = args; } } });
  assert.equal(registration[0], 'done-whale');
  assert.equal(registration[1], WhaleSettingsSchema);
  assert.deepEqual(WhaleSettingsSchema({}), { green: '#22C55E', amber: '#F59E0B' });
  assert.throws(() => WhaleSettingsSchema({ green: 'red' }));
});

test('Git installs have prebuilt entries and no install-time build hooks', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  for (const entry of [pkg.exports['.'], pkg.exports['./client'], pkg.dsh.bundle.patch]) {
    assert.ok(readFileSync(entry).length);
  }
  for (const hook of ['prepare', 'preinstall', 'install', 'postinstall', 'prepack']) {
    assert.equal(pkg.scripts[hook], undefined);
  }
  assert.ok(pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-ui-session'));
  assert.ok(!pkg.dsh.client.inject.includes('@deepseek-ai/dsh-client-runtime'));
});
