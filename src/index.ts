/**
 * @brashkie/media-core
 *
 * Core engine for the Kryx multimedia ecosystem.
 *
 * This is the public entry point. It loads the native Rust addon (via
 * napi-rs) at runtime and re-exports it alongside the pure-TypeScript
 * layer (errors, types, pipeline).
 */

// ─── Native addon contracts ─────────────────────────────────────────────────
//
// We declare the native addon's shape locally rather than relying on the
// auto-generated `../index.d.ts`. This makes `tsup` and `tsc` work even
// when the native binary hasn't been built yet, and isolates us from any
// future format changes in napi-rs codegen.

/** A timestamp wrapping a Rust `Timestamp` value (PTS in some timebase). */
export interface JsTimestamp {
  readonly pts: number
  readonly isValid: boolean
}

/** Static surface of the `JsTimestamp` native class. */
export interface JsTimestampConstructor {
  new (pts: number): JsTimestamp
  none(): JsTimestamp
  zero(): JsTimestamp
}

/** A zero-copy media frame buffer wrapping a Rust `MediaBuffer`. */
export interface JsMediaBuffer {
  readonly pts: number
  readonly len: number
  readonly isEmpty: boolean
  readonly isKeyframe: boolean
  readonly isEos: boolean
  readonly mediaType: string
  readonly codecId: string
  data(): Buffer
}

/** Static surface of the `JsMediaBuffer` native class. */
export interface JsMediaBufferConstructor {
  video(data: Buffer | Uint8Array, pts: number): JsMediaBuffer
  audio(data: Buffer | Uint8Array, pts: number): JsMediaBuffer
  eosVideo(): JsMediaBuffer
}

/** Shape of the loaded native addon. */
interface NativeAddon {
  JsTimestamp: JsTimestampConstructor
  JsMediaBuffer: JsMediaBufferConstructor
  version(): string
}

// ─── Load the native addon ──────────────────────────────────────────────────
//
// We use a plain `require()` here. tsup keeps it as `require()` in the CJS
// output and shims it via `createRequire(import.meta.url)` in the ESM output
// (see `tsup.config.ts` `shims: true`).
//
// The path `../index.js` resolves to the napi-rs-generated loader which
// dispatches to the correct platform-specific `.node` binary via
// `optionalDependencies`.

let nativeAddon: NativeAddon

try {
  nativeAddon = require('../index.js') as NativeAddon
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err)
  throw new Error(
    `[@brashkie/media-core] failed to load native addon: ${msg}\n` +
      `Make sure you ran 'npm run build:native:debug' or installed the package via npm.`,
  )
}

// ─── Public re-exports (native) ─────────────────────────────────────────────

/**
 * Zero-copy media frame buffer.
 *
 * @example
 * ```ts
 * const buf = MediaBuffer.video(data, 90_000)
 * console.log(buf.pts, buf.mediaType)
 * ```
 */
export const MediaBuffer: JsMediaBufferConstructor = nativeAddon.JsMediaBuffer

/**
 * Native timestamp class (rarely used directly; prefer the `Timestamp`
 * helpers from this module).
 */
export const NativeTimestamp: JsTimestampConstructor = nativeAddon.JsTimestamp

/** Returns the version reported by the linked native addon. */
export function nativeAddonVersion(): string {
  return nativeAddon.version()
}

// Type aliases — let consumers use `MediaBuffer` as a type, too.
export type MediaBuffer = JsMediaBuffer

// ─── TypeScript layer ───────────────────────────────────────────────────────

export * from './types'
export * from './pipeline'
export * from './error'

// ─── Package version ────────────────────────────────────────────────────────

/** npm package version of `@brashkie/media-core`. */
export const VERSION = '0.1.2'
