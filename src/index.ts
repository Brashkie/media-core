/**
 * @brashkie/media-core
 *
 * Core engine for the Kryx multimedia ecosystem.
 *
 * This is the public entry point. It re-exports everything users need:
 * the native Rust addon (via napi-rs) and the pure TypeScript layer.
 */

// ─── Native addon (Rust → napi-rs) ──────────────────────────────────────────
//
// These are generated at build time by `napi build` into `../index.{js,d.ts}`.
// We re-export with friendlier names.
import {
  JsMediaBuffer as NativeMediaBuffer,
  JsTimestamp as NativeTimestamp,
  version as nativeVersion,
} from '../index'

export const MediaBuffer = NativeMediaBuffer
export const NativeTs = NativeTimestamp
export type MediaBuffer = InstanceType<typeof NativeMediaBuffer>
export type NativeTs = InstanceType<typeof NativeTimestamp>

/** Returns the version of the linked native addon. */
export function nativeAddonVersion(): string {
  return nativeVersion()
}

// ─── Public TypeScript API ──────────────────────────────────────────────────

export * from './types'
export * from './pipeline'
export * from './error'

// ─── Package version (from compile-time) ────────────────────────────────────

/** Version of the `@brashkie/media-core` package (npm version). */
export const VERSION = '0.1.0'
