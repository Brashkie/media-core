# Changelog

All notable changes to `@brashkie/media-core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- *(nothing yet — see [ROADMAP](docs/ROADMAP.md))*

---

## [0.1.4] — 2026-05-26

### Fixed
- **Critical for downstream consumers**: tsup's `shims: true` option rewrote
  the runtime `require('../index.js')` into a `__require()` helper that
  throws `'Dynamic require of "../index.js" is not supported'` whenever
  `require` is not available at runtime. This broke any consumer running
  inside Vitest, Vite, or other tools that load CJS via an ESM wrapper —
  including `@brashkie/media-codecs` tests.
- Removed `shims: true` from `tsup.config.ts`.
- Rewrote `src/index.ts` to use `createRequire` from `node:module`
  explicitly, with a CJS/ESM dual-path that resolves the module base from
  either `__filename` or `import.meta.url`. Now works identically in
  Node CJS, Node ESM, and Vitest.

### Notes
- Consumers of `@brashkie/media-core` should upgrade to `^0.1.4`.
- `0.1.3` is being deprecated on npm.

---

## [0.1.3] — 2026-05-25

### Fixed
- tsup build only emitted a single `.d.mts` file even though `outExtension`
  requested both `.d.cts` and `.d.mts`. Switched to a post-build script
  (`scripts/fix-dts.js`) that duplicates `index.d.ts` into the per-format
  variants required by the `exports` map.

### Known issues
- The `shims: true` config still broke downstream consumers (fixed in 0.1.4).

---

## [0.1.2] — 2026-05-25

### Fixed
- `tsup` DTS build failed because the auto-generated `index.d.ts` from napi
  wasn't recognized as a module. `src/index.ts` now declares the native
  addon's shape inline, decoupling the TypeScript layer from napi's codegen.
- Native addon loading: `index.js` placeholder now gracefully stubs when
  the `.node` binary is missing, throwing only on actual use.
- ESM build: enabled `tsup` `shims: true` so the runtime `require()` of the
  native addon works in both CJS and ESM outputs. **NOTE**: this turned out
  to be incorrect — fixed in 0.1.4.

### Changed
- `MediaBuffer` is now exported as both a value (constructor) and a type alias.

---

## [0.1.1] — 2026-05-24

### Fixed
- CI/build: migrated from `@napi-rs/cli` v2 to v3 syntax — but later reverted
  in 0.1.2 because v3 requires Node 20+, breaking our Alpine CI on Node 18.
- `scripts/create-npm-dirs.js` now also copies the `.node` binaries from
  CI artifacts into each per-platform npm package directory.

---

## [0.1.0] — 2026-05-24

**First public release.** Foundation layer of the Kryx ecosystem.

### Added
- `MediaBuffer` — zero-copy refcounted frame buffer with metadata
- `Pipeline` + `PipelineBuilder` with async stages, fan-out, AbortSignal
- Built-in stages: `PassthroughStage`, `DropStage`, `CounterStage`, `tapStage`
- `Timebase` + `Timestamp` for exact rational timestamp arithmetic
- `MediaType`, `CodecId`, `PixelFormat`, `SampleFormat` discriminants
- `MediaError` hierarchy with `kind`, `context`, `details`, ES2022 `cause`
- `MasterClock` + `StreamClock` for A/V synchronization
- `MediaSource` + `MediaSink` async I/O traits
- FFI bridge for Zig modules (feature-gated)
- Dual ESM + CJS build via `tsup` with proper `.d.mts` / `.d.cts`
- TypeScript 6.0 strict mode
- 7 platforms supported via per-platform npm sub-packages
- Cross-platform CI
- 16 Rust tests + 85+ TypeScript tests
- ≥95% coverage target

---

[Unreleased]: https://github.com/Brashkie/media-core/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/Brashkie/media-core/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/Brashkie/media-core/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Brashkie/media-core/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Brashkie/media-core/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Brashkie/media-core/releases/tag/v0.1.0
