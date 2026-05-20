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
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
      dts: format === 'esm' ? '.d.mts' : '.d.cts',
    }
  },
  external: ['../index'], // native .node addon
})
