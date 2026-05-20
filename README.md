<div align="center">

<img src="media/logo.png" alt="Kryx" width="120" />

# `@brashkie/media-core`

**Core engine for the [Kryx](https://kryx.dev) multimedia ecosystem**

*Zero-copy media buffers · Async pipelines · A/V sync · FFI bridge to Zig*

[![CI](https://github.com/Brashkie/media-core/actions/workflows/ci.yml/badge.svg)](https://github.com/Brashkie/media-core/actions)
[![npm version](https://img.shields.io/npm/v/@brashkie/media-core?color=cb3837&logo=npm)](https://npmjs.com/package/@brashkie/media-core)
[![npm downloads](https://img.shields.io/npm/dm/@brashkie/media-core?color=cb3837&logo=npm)](https://npmjs.com/package/@brashkie/media-core)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![rust 1.80+](https://img.shields.io/badge/rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org)
[![node ≥18](https://img.shields.io/badge/node-%E2%89%A518-3c873a?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-%E2%89%A595%25-brightgreen)](#testing)

**English** · [Español](README.es.md) · [API Docs](https://docs.kryx.dev/media-core) · [Roadmap](docs/ROADMAP.md) · [Architecture](docs/ARCHITECTURE.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

</div>

---

## ✨ What is `@brashkie/media-core`?

`@brashkie/media-core` is the **foundational layer** of the [Kryx](https://kryx.dev) multimedia ecosystem — think of it as `libavutil` for a modern Node.js world.

It gives you the primitives every multimedia tool needs, with **zero compromises**:

| | |
|---|---|
| 🎯 **Zero-copy buffers** | Frames pass through pipelines without ever being copied |
| ⚡ **Native performance** | Hot paths in Rust, ultra-low-level codecs in Zig |
| 🔌 **Async-first** | Built around `async`/`await` — backpressure, AbortSignal, streams |
| 🧩 **Composable** | Stages snap together; pipelines plug into pipelines |
| 🔒 **Type-safe** | Strict TypeScript + napi-rs auto-generated `.d.ts` |
| 📦 **Dual-package** | Native CJS + ESM with first-class TypeScript support |
| 🌐 **Cross-platform** | Windows, macOS, Linux on x64 and arm64 |
| 🧪 **Battle-tested** | 100+ tests across Rust and TypeScript, ≥95% coverage |

---

## 📦 The Kryx ecosystem

`@brashkie/media-core` is the foundation. Every other package builds on top of it:

```
                          ┌─────────────────┐
                          │      kryx       │  ← unified SDK (the "FFmpeg" facade)
                          └────────┬────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
┌────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐
│ media-video    │  │ media-audio          │  │ media-subtitles     │
│ media-codecs   │  │ media-ai             │  │ media-stream        │
│ media-gpu      │  │ media-containers     │  │ media-cli           │
└────────┬───────┘  └──────────┬───────────┘  └──────────┬──────────┘
         │                     │                          │
         └─────────────────────┼──────────────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  @brashkie/media-core │   ← you are here
                    │   (Rust + napi-rs)    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Zig low-level       │
                    │   (codecs, SIMD, GPU) │
                    └──────────────────────┘
```

---

## 🚀 Installation

```bash
npm install @brashkie/media-core
# or
pnpm add @brashkie/media-core
# or
yarn add @brashkie/media-core
```

**Prebuilt binaries** are shipped for all supported platforms — no Rust toolchain required for end users.

| OS | Architectures |
|----|---------------|
| 🪟 Windows | x64, arm64 (MSVC) |
| 🍎 macOS | x64, arm64 (Apple Silicon) |
| 🐧 Linux | x64 (glibc), x64 (musl), arm64 (glibc) |

---

## 🎬 Quick start

### TypeScript / ESM

```ts
import {
  MediaBuffer,
  Pipeline,
  PassthroughStage,
  CounterStage,
  tapStage,
  Timebase,
  nativeAddonVersion,
} from '@brashkie/media-core'

console.log(`Native: ${nativeAddonVersion()}`)

// Build a pipeline
const counter = new CounterStage()

const pipeline = Pipeline.builder()
  .name('demo')
  .stage(PassthroughStage)
  .stage(tapStage('log', (frame, ctx) => {
    console.log(`frame #${ctx.frameCount} @ pts=${frame.pts}`)
  }))
  .stage(counter)
  .build()

await pipeline.start()

const buf = MediaBuffer.video(rawH264Data, /* pts */ 90_000)
const output = await pipeline.process(buf)

console.log(`Processed ${counter.count} frames`)
await pipeline.stop()
```

### CommonJS

```js
const { MediaBuffer, Pipeline, PassthroughStage } = require('@brashkie/media-core')

const pipeline = Pipeline.builder().stage(PassthroughStage).build()
pipeline.process(MediaBuffer.video(data, 0)).then(console.log)
```

### Streams (async iterables)

```ts
async function* sourceFrames() {
  while (hasMore) yield await readFrame()
}

for await (const frame of pipeline.processStream(sourceFrames())) {
  await writeFrame(frame)
}
```

### Cancellation with AbortSignal

```ts
const ac = new AbortController()
const pipeline = Pipeline.builder()
  .stage(myStage)
  .signal(ac.signal)
  .build()

setTimeout(() => ac.abort('user cancelled'), 5000)
await pipeline.process(buf) // throws MediaError if aborted
```

---

## 🏗️ Architecture

```
TypeScript (your code)
       │
       ▼
┌─────────────────────────────────────┐
│  src/  (TypeScript layer)           │
│  ├── pipeline.ts  — async pipelines │
│  ├── types.ts     — Timebase, etc.  │
│  ├── error.ts     — error hierarchy │
│  └── index.ts     — public surface  │
└─────────────────────────────────────┘
       │ napi-rs bindings
       ▼
┌─────────────────────────────────────┐
│  crates/mc-node/   (cdylib)         │
│  └── napi #[napi] wrappers          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  crates/mc-core/   (pure Rust)      │
│  ├── buffer/      — zero-copy bufs  │
│  ├── pipeline/    — Stage trait     │
│  ├── sync/        — A/V clocks      │
│  ├── io/          — Source/Sink     │
│  ├── ffi/         — Zig bridge      │
│  ├── types/       — shared types    │
│  └── utils/                         │
└─────────────────────────────────────┘
       │ FFI (feature: link-zig)
       ▼
┌─────────────────────────────────────┐
│  Zig low-level modules              │
│  (codecs, GPU, SIMD)                │
│  shipped in @brashkie/media-codecs  │
└─────────────────────────────────────┘
```

Full architecture details in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 📚 Core concepts

### 1. `MediaBuffer` — the unit of data

Wraps a refcounted byte buffer with metadata: codec, PTS/DTS, frame flags, stream index, optional video/audio metadata. **Cloning is zero-cost** — only a refcount bump.

```ts
const frame = MediaBuffer.video(data, /* pts */ 90_000)
frame.pts          // 90000
frame.codecId      // 'h264'
frame.mediaType    // 'video'
frame.isKeyframe   // false
frame.isEos        // false
```

### 2. `Stage` — a processing unit

Receives one frame, returns zero or more frames:

```ts
const myFilter: Stage = {
  name: 'my-filter',
  async process(frame, ctx) {
    if (frame.isEos) return [frame]
    return [await transform(frame)]
  },
  async onStart() { /* allocate resources */ },
  async onStop()  { /* free resources */ },
}
```

Behaviors:
- Return `[frame]` → pass through
- Return `[]` → drop the frame
- Return `[a, b, c]` → fan out

### 3. `Pipeline` — composition

```ts
const pipeline = Pipeline.builder()
  .name('transcode')
  .stage(decoder)
  .stage(resizer)
  .stage(encoder)
  .signal(abortController.signal)
  .onError((err, stage) => console.error(`${stage} failed:`, err))
  .build()
```

### 4. `Timebase` — exact timestamp math

```ts
Timebase.VIDEO_90K        // 1/90000
Timebase.AUDIO_48K        // 1/48000
Timebase.of(1, 25)        // custom (25 fps)

// Rescale safely (uses BigInt internally — no precision loss)
Timebase.VIDEO_90K.rescale(90_000, Timebase.MILLISECOND) // → 1000
```

### 5. Error hierarchy

```ts
try {
  await pipeline.process(buf)
} catch (err) {
  if (MediaError.is(err)) {
    switch (err.kind) {
      case 'pipeline':    /* ... */ break
      case 'unsupported': /* ... */ break
      case 'timeout':     /* ... */ break
    }
  }
}
```

All errors carry `kind`, `context`, `details`, and a proper `cause` chain.

---

## 🛠️ Development

### Prerequisites

- [Rust ≥1.80](https://rustup.rs) (`rustup install stable`)
- Node.js ≥18
- `@napi-rs/cli` installed globally: `npm i -g @napi-rs/cli`

### Setup

```bash
git clone https://github.com/Brashkie/media-core.git
cd media-core
npm install
npm run build:debug   # builds Rust + TS
```

### Common scripts

| Command | Description |
|---------|-------------|
| `npm run build`            | Production build (native + TS) |
| `npm run build:debug`      | Debug build (faster compile, no opt) |
| `npm run build:native`     | Build only the Rust addon |
| `npm run build:ts`         | Build only the TypeScript layer |
| `npm test`                 | Run Rust + TS + dual-CJS/ESM tests |
| `npm run test:rust`        | Rust tests only |
| `npm run test:vitest`      | TypeScript tests only |
| `npm run test:watch`       | Watch mode for TS tests |
| `npm run test:coverage`    | Coverage report (text + lcov + html) |
| `npm run test:coverage:ui` | Interactive coverage UI |
| `npm run typecheck`        | `tsc --noEmit` |
| `npm run lint`             | ESLint on TypeScript |
| `npm run clippy`           | Clippy on Rust |
| `npm run format`           | Prettier (TS) |
| `npm run format:rust`      | rustfmt |
| `npm run examples`         | Run all example files |
| `npm run clean`            | Remove `dist/`, `target/`, `.node` |

### Project structure

```
media-core/
├── src/                    # TypeScript source (ESM + CJS via tsup)
│   ├── index.ts            # public API surface
│   ├── pipeline.ts         # async pipeline + Stage trait
│   ├── types.ts            # Timebase, Timestamp, MediaType, CodecId
│   └── error.ts            # MediaError hierarchy
│
├── crates/
│   ├── mc-core/            # pure Rust core (no Node deps)
│   │   └── src/
│   │       ├── buffer/     # zero-copy MediaBuffer
│   │       ├── pipeline/   # Pipeline + Stage trait
│   │       ├── sync/       # MasterClock + StreamClock
│   │       ├── io/         # MediaSource + MediaSink
│   │       ├── ffi/        # Zig bridge (feature-gated)
│   │       ├── types/      # shared types
│   │       └── utils/
│   │
│   └── mc-node/            # napi-rs bindings (cdylib → .node)
│       └── src/lib.rs
│
├── __tests__/              # Vitest + dual CJS/ESM tests
│   ├── index.test.ts       # main test suite (100+ tests)
│   ├── setup.ts            # native addon mock
│   ├── cjs.test.cjs        # CJS smoke
│   └── esm.test.mjs        # ESM smoke
│
├── examples/               # Runnable examples (cjs/esm/ts)
├── scripts/                # Build helpers (per-platform npm pkgs)
├── npm/                    # Per-platform native package dirs
├── docs/                   # ARCHITECTURE, ROADMAP, CONTRIBUTING, etc.
└── .github/workflows/      # CI: test matrix + artifact builds
```

---

## 🧪 Testing

```bash
npm test
```

Runs:
1. **16 Rust tests** in `crates/mc-core` (buffer, pipeline, types, ffi, sync, smoke)
2. **85+ TypeScript tests** with Vitest (error hierarchy, Timebase, Pipeline lifecycle, AbortSignal, fan-out, async stages, mock native bindings)
3. **Dual-package smoke** verifying both CJS and ESM imports resolve

Target coverage: **≥95%** across all files. Run `npm run test:coverage` and open `coverage/index.html`.

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Code style (rustfmt + prettier)
- Commit conventions (Conventional Commits)
- PR checklist (tests + types + docs)
- Local development workflow

---

## 🗺️ Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the full plan. Highlights:

- **v0.2** — GPU buffer abstractions + hardware-accelerated paths
- **v0.3** — Real-time / streaming primitives (WebRTC interop)
- **v0.4** — First-class plugin system for third-party stages
- **v1.0** — Stable API, all Kryx ecosystem packages on top

---

## ❓ FAQ

<details>
<summary><b>Do I need Rust installed to use this?</b></summary>

No. Prebuilt binaries are shipped for all supported platforms via npm `optionalDependencies`. Just `npm install @brashkie/media-core`.

You only need Rust if you're **contributing** or building from source.
</details>

<details>
<summary><b>Why two languages (Rust + Zig)?</b></summary>

Rust owns the orchestration: pipelines, async, networking, plugins, ABI to Node. Zig owns the hottest paths: codec internals, SIMD, GPU compute. Each language wins at its layer.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full reasoning.
</details>

<details>
<summary><b>How does this compare to FFmpeg?</b></summary>

FFmpeg is a complete (and brilliant) C codebase from 2000. `media-core` is the **foundation** for a modern, ecosystem-driven alternative built around:

- Composable modules instead of one monolith
- Native async + streams (no callbacks)
- Memory safety by default (Rust)
- Real-time and AI built in from day one (later packages)

This package alone does NOT replace FFmpeg — it's the toolkit other Kryx packages use to gradually build something equivalent.
</details>

<details>
<summary><b>Is this production-ready?</b></summary>

The API is stable in spirit but still pre-1.0. We do not guarantee breaking changes won't happen between minor versions before 1.0. After 1.0 we follow strict semver.

For production use today: pin to an exact version (`"0.1.0"` not `"^0.1.0"`).
</details>

<details>
<summary><b>How does it relate to napi-rs?</b></summary>

`napi-rs` is the FFI bridge we use to expose Rust types to Node.js. The `crates/mc-node` crate contains `#[napi]` annotations; everything else is plain Rust in `crates/mc-core`.
</details>

---

## 📜 License

Licensed under [Apache-2.0](LICENSE).

Copyright © 2025 [Brashkie](https://github.com/Brashkie). All rights reserved.

---

<div align="center">

**Made with 🦀 + ⚡ for the modern multimedia web.**

[Website](https://kryx.dev) · [Issues](https://github.com/Brashkie/media-core/issues) · [Discussions](https://github.com/Brashkie/media-core/discussions)

</div>
