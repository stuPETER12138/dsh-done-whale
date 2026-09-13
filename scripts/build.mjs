import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.mjs'], outfile: 'lib/index.mjs',
  bundle: true, platform: 'node', format: 'esm', packages: 'external', target: 'node22',
});
await build({
  entryPoints: ['src/client.mjs'], outfile: 'lib/client.cjs',
  bundle: true, platform: 'browser', format: 'cjs', external: ['react'], target: 'es2022',
  banner: { js: 'window.__ModuleLoader__.load({ id: "dsh-done-whale", factory: (require) => {\nconst module = { exports: {} }; const exports = module.exports;' },
  footer: { js: 'return module.exports;\n} });' },
});
