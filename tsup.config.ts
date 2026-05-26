import { defineConfig } from 'tsup'

/**
 * tsup config for @brashkie/media-core
 *
 * Generates dual-package output. Per-format DTS files (.d.cts / .d.mts) are
 * created by a separate post-build script (scripts/fix-dts.js) because
 * tsup 8.x has a bug where `outExtension.dts` is ignored for `dts: true`
 * in multi-format mode, AND `onSuccess` runs before the DTS build finishes.
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  shims: true,
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    }
  },
  external: ['../index.js', '../index'],
})