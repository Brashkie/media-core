import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  treeshake: true,
  shims: true, // inject CJS-compat shims into ESM (require, __dirname, __filename)
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
      dts: format === 'esm' ? '.d.mts' : '.d.cts',
    }
  },
  // The native addon path must remain external — never bundle it.
  external: ['../index.js', '../index'],
})
