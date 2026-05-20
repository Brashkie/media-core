# Changelog

All notable changes to `@brashkie/media-core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- *(nothing yet — see [ROADMAP](docs/ROADMAP.md))*

### Changed
- *(nothing yet)*

### Deprecated
- *(nothing yet)*

### Removed
- *(nothing yet)*

### Fixed
- *(nothing yet)*

### Security
- *(nothing yet)*

---

## [0.1.0] — 2025-01-01

**First public release.** Foundation layer of the Kryx ecosystem.

### Added

#### Core types
- `MediaBuffer` — zero-copy refcounted frame buffer with metadata
- `MediaBufferMut` — growable buffer for incremental writes
- `FrameFlags` bitflags: `KEYFRAME`, `CORRUPT`, `DISCARD`, `END_OF_STREAM`, `DECODED`, `ENCODED`
- `VideoMeta`, `AudioMeta`, `FrameMeta` — type-specific metadata
- `Timestamp` + `Timebase` — exact rational timestamp arithmetic (BigInt-backed in TS)
- `MediaType`, `CodecId`, `PixelFormat`, `SampleFormat` discriminants
- `StreamInfo` for container metadata

#### Pipeline
- `Pipeline` + `PipelineBuilder` (both Rust and TypeScript)
- `Stage` trait/interface with `process`, `onStart`, `onStop`
- Built-in stages: `PassthroughStage`, `DropStage`, `CounterStage`
- `tapStage()` helper for side-effect stages
- Frame-by-frame processing, batch (`processBatch`), and stream (`processStream`)
- Fan-out (return multiple frames) and drop (return empty) semantics
- AbortSignal support for cooperative cancellation
- `onError` hook for centralized error handling
- Auto-start on first `process()` call
- Idempotent `start()` / `stop()`

#### Synchronization
- `MasterClock` with configurable clock source (audio/video/external)
- `StreamClock` with drift computation in milliseconds
- Configurable drift threshold (`MAX_DRIFT_MS`)
- `wait_duration()` and `should_skip()` helpers

#### I/O
- `MediaSource` async trait for readers
- `MediaSink` async trait for writers
- `MemorySource` / `MemorySink` for testing
- `SeekMode` enum: `Backward`, `Forward`, `Exact`

#### FFI bridge
- `ZigBufferView` and `ZigBufferOut` C-compatible types
- `ZigResult` C-compatible return codes
- `zig_module_version()` and `probe_zig_runtime()` safe wrappers
- `link-zig` feature flag — defaults to internal stubs

#### Error handling
- `MediaError` base class with `kind`, `context`, `details`, ES2022 `cause`
- Subclasses: `BufferError`, `PipelineError`, `IoError`, `FfiError`, `SyncError`
- Type guards: `MediaError.is()`, `MediaError.isKind()`
- Normalization helper: `MediaError.from(unknown)`
- Predicates: `isFatal`, `isRecoverable`
- `toJSON()` for safe serialization

#### Tooling
- Dual ESM + CJS build via `tsup` with proper `.d.mts` / `.d.cts`
- TypeScript 6.0 strict mode
- Per-platform native packages: win32-x64-msvc, win32-arm64-msvc, darwin-x64, darwin-arm64, linux-x64-gnu, linux-x64-musl, linux-arm64-gnu
- CI matrix across Linux / macOS / Windows × Node 18, 20, 22
- Vitest test suite with native addon mocking
- ≥95% coverage target with v8 provider
- Rust + TypeScript example files (ESM, CJS, TS)
- ESLint + Prettier + clippy + rustfmt configurations
- Documentation: README (en/es), ARCHITECTURE, ROADMAP, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT

### Notes

This is a **pre-1.0 release**. The public API may change in minor versions before 1.0. Pin to exact versions in production.

---

[Unreleased]: https://github.com/Brashkie/media-core/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Brashkie/media-core/releases/tag/v0.1.0
