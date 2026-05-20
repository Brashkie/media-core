<div align="center">

<img src="media/logo.png" alt="Kryx" width="120" />

# `@brashkie/media-core`

**Motor central del ecosistema multimedia [Kryx](https://kryx.dev)**

*Buffers zero-copy · Pipelines asíncronas · Sincronización A/V · Puente FFI a Zig*

[![CI](https://github.com/Brashkie/media-core/actions/workflows/ci.yml/badge.svg)](https://github.com/Brashkie/media-core/actions)
[![npm version](https://img.shields.io/npm/v/@brashkie/media-core?color=cb3837&logo=npm)](https://npmjs.com/package/@brashkie/media-core)
[![npm downloads](https://img.shields.io/npm/dm/@brashkie/media-core?color=cb3837&logo=npm)](https://npmjs.com/package/@brashkie/media-core)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![rust 1.80+](https://img.shields.io/badge/rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org)
[![node ≥18](https://img.shields.io/badge/node-%E2%89%A518-3c873a?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![coverage](https://img.shields.io/badge/coverage-%E2%89%A595%25-brightgreen)](#testing)

[English](README.md) · **Español** · [Documentación API](https://docs.kryx.dev/media-core) · [Roadmap](docs/ROADMAP.md) · [Arquitectura](docs/ARCHITECTURE.md) · [Contribuir](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

</div>

---

## ✨ ¿Qué es `@brashkie/media-core`?

`@brashkie/media-core` es la **capa fundacional** del ecosistema multimedia [Kryx](https://kryx.dev) — piénsalo como un `libavutil` para el Node.js moderno.

Te da las primitivas que toda herramienta multimedia necesita, **sin compromisos**:

| | |
|---|---|
| 🎯 **Buffers zero-copy** | Los frames pasan por los pipelines sin copiarse nunca |
| ⚡ **Rendimiento nativo** | Rutas críticas en Rust, codecs ultra-bajos en Zig |
| 🔌 **Async-first** | Construido sobre `async`/`await` — backpressure, AbortSignal, streams |
| 🧩 **Componible** | Las stages se enganchan; los pipelines se conectan entre sí |
| 🔒 **Type-safe** | TypeScript estricto + `.d.ts` autogenerados por napi-rs |
| 📦 **Dual-package** | CJS + ESM nativo con soporte de primera clase para TypeScript |
| 🌐 **Multiplataforma** | Windows, macOS, Linux en x64 y arm64 |
| 🧪 **Probado en serio** | Más de 100 tests en Rust y TypeScript, cobertura ≥95% |

---

## 📦 El ecosistema Kryx

`@brashkie/media-core` es la base. Todos los demás paquetes se construyen encima:

```
                          ┌─────────────────┐
                          │      kryx       │  ← SDK unificado (la "fachada FFmpeg")
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
                    │  @brashkie/media-core │   ← estás aquí
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

## 🚀 Instalación

```bash
npm install @brashkie/media-core
# o
pnpm add @brashkie/media-core
# o
yarn add @brashkie/media-core
```

**Los binarios precompilados** se distribuyen para todas las plataformas soportadas — no necesitas instalar Rust para usar el paquete.

| SO | Arquitecturas |
|----|---------------|
| 🪟 Windows | x64, arm64 (MSVC) |
| 🍎 macOS | x64, arm64 (Apple Silicon) |
| 🐧 Linux | x64 (glibc), x64 (musl), arm64 (glibc) |

---

## 🎬 Inicio rápido

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

console.log(`Nativo: ${nativeAddonVersion()}`)

// Construir un pipeline
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

const buf = MediaBuffer.video(datosH264, /* pts */ 90_000)
const salida = await pipeline.process(buf)

console.log(`Procesados ${counter.count} frames`)
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
async function* fuenteFrames() {
  while (hayMas) yield await leerFrame()
}

for await (const frame of pipeline.processStream(fuenteFrames())) {
  await escribirFrame(frame)
}
```

### Cancelación con AbortSignal

```ts
const ac = new AbortController()
const pipeline = Pipeline.builder()
  .stage(miStage)
  .signal(ac.signal)
  .build()

setTimeout(() => ac.abort('cancelado por el usuario'), 5000)
await pipeline.process(buf) // lanza MediaError si se aborta
```

---

## 🏗️ Arquitectura

```
TypeScript (tu código)
       │
       ▼
┌─────────────────────────────────────┐
│  src/  (capa TypeScript)            │
│  ├── pipeline.ts  — pipelines async │
│  ├── types.ts     — Timebase, etc.  │
│  ├── error.ts     — jerarquía errors│
│  └── index.ts     — superficie API  │
└─────────────────────────────────────┘
       │ bindings napi-rs
       ▼
┌─────────────────────────────────────┐
│  crates/mc-node/   (cdylib)         │
│  └── wrappers napi #[napi]          │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  crates/mc-core/   (Rust puro)      │
│  ├── buffer/      — bufs zero-copy  │
│  ├── pipeline/    — trait Stage     │
│  ├── sync/        — relojes A/V     │
│  ├── io/          — Source/Sink     │
│  ├── ffi/         — puente Zig      │
│  ├── types/       — tipos compartid.│
│  └── utils/                         │
└─────────────────────────────────────┘
       │ FFI (feature: link-zig)
       ▼
┌─────────────────────────────────────┐
│  Módulos Zig low-level              │
│  (codecs, GPU, SIMD)                │
│  vienen en @brashkie/media-codecs   │
└─────────────────────────────────────┘
```

Detalles completos en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## 📚 Conceptos centrales

### 1. `MediaBuffer` — la unidad de datos

Envuelve un buffer de bytes con refcount + metadatos: codec, PTS/DTS, flags, índice de stream, metadatos opcionales de video/audio. **Clonarlo es gratis** — solo incrementa un contador.

```ts
const frame = MediaBuffer.video(data, /* pts */ 90_000)
frame.pts          // 90000
frame.codecId      // 'h264'
frame.mediaType    // 'video'
frame.isKeyframe   // false
frame.isEos        // false
```

### 2. `Stage` — una unidad de procesamiento

Recibe un frame, devuelve cero o más frames:

```ts
const miFiltro: Stage = {
  name: 'mi-filtro',
  async process(frame, ctx) {
    if (frame.isEos) return [frame]
    return [await transformar(frame)]
  },
  async onStart() { /* asignar recursos */ },
  async onStop()  { /* liberar recursos */ },
}
```

Comportamientos:
- Devolver `[frame]` → pasar a través
- Devolver `[]` → descartar el frame
- Devolver `[a, b, c]` → fan-out

### 3. `Pipeline` — composición

```ts
const pipeline = Pipeline.builder()
  .name('transcode')
  .stage(decoder)
  .stage(resizer)
  .stage(encoder)
  .signal(abortController.signal)
  .onError((err, stage) => console.error(`${stage} falló:`, err))
  .build()
```

### 4. `Timebase` — aritmética exacta de timestamps

```ts
Timebase.VIDEO_90K        // 1/90000
Timebase.AUDIO_48K        // 1/48000
Timebase.of(1, 25)        // personalizado (25 fps)

// Reescalar con precisión (usa BigInt internamente)
Timebase.VIDEO_90K.rescale(90_000, Timebase.MILLISECOND) // → 1000
```

### 5. Jerarquía de errores

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

Todos los errores llevan `kind`, `context`, `details` y una cadena de `cause` apropiada.

---

## 🛠️ Desarrollo

### Requisitos

- [Rust ≥1.80](https://rustup.rs) (`rustup install stable`)
- Node.js ≥18
- `@napi-rs/cli` instalado globalmente: `npm i -g @napi-rs/cli`

### Setup

```bash
git clone https://github.com/Brashkie/media-core.git
cd media-core
npm install
npm run build:debug   # compila Rust + TS
```

### Scripts comunes

| Comando | Descripción |
|---------|-------------|
| `npm run build`            | Build de producción (nativo + TS) |
| `npm run build:debug`      | Build debug (más rápido, sin optimizar) |
| `npm run build:native`     | Solo el addon Rust |
| `npm run build:ts`         | Solo la capa TypeScript |
| `npm test`                 | Tests Rust + TS + dual CJS/ESM |
| `npm run test:rust`        | Solo tests Rust |
| `npm run test:vitest`      | Solo tests TypeScript |
| `npm run test:watch`       | Modo watch para tests TS |
| `npm run test:coverage`    | Reporte de cobertura |
| `npm run test:coverage:ui` | UI interactiva de cobertura |
| `npm run typecheck`        | `tsc --noEmit` |
| `npm run lint`             | ESLint sobre TypeScript |
| `npm run clippy`           | Clippy sobre Rust |
| `npm run format`           | Prettier (TS) |
| `npm run format:rust`      | rustfmt |
| `npm run examples`         | Ejecuta todos los ejemplos |
| `npm run clean`            | Borra `dist/`, `target/`, `.node` |

---

## 🧪 Testing

```bash
npm test
```

Ejecuta:
1. **16 tests Rust** en `crates/mc-core`
2. **85+ tests TypeScript** con Vitest
3. **Smoke dual-package** verificando que CJS y ESM resuelven

Objetivo de cobertura: **≥95%**. Corre `npm run test:coverage` y abre `coverage/index.html`.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Ver [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🗺️ Roadmap

Ver [docs/ROADMAP.md](docs/ROADMAP.md) para el plan completo. Lo más destacado:

- **v0.2** — Abstracciones de buffers GPU + rutas con aceleración por hardware
- **v0.3** — Primitivas en tiempo real / streaming (interop WebRTC)
- **v0.4** — Sistema de plugins para stages de terceros
- **v1.0** — API estable, todo el ecosistema Kryx encima

---

## ❓ Preguntas frecuentes

<details>
<summary><b>¿Necesito Rust instalado para usar esto?</b></summary>

No. Los binarios precompilados vienen por npm `optionalDependencies` para todas las plataformas soportadas. Solo `npm install @brashkie/media-core`.

Solo necesitas Rust si vas a **contribuir** o compilar desde el código fuente.
</details>

<details>
<summary><b>¿Por qué dos lenguajes (Rust + Zig)?</b></summary>

Rust se encarga de la orquestación: pipelines, async, networking, plugins, ABI a Node. Zig se encarga de las rutas más calientes: codecs internos, SIMD, GPU compute. Cada lenguaje gana en su capa.

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) para el razonamiento completo.
</details>

<details>
<summary><b>¿Cómo se compara con FFmpeg?</b></summary>

FFmpeg es una base de código C completa (y brillante) del año 2000. `media-core` es la **base** para una alternativa moderna construida alrededor de:

- Módulos componibles en vez de un monolito
- Async + streams nativos (sin callbacks)
- Seguridad de memoria por defecto (Rust)
- Tiempo real e IA integrados desde el día uno (en paquetes posteriores)

Este paquete por sí solo NO reemplaza FFmpeg — es el kit que los demás paquetes Kryx usan para construir algo equivalente.
</details>

<details>
<summary><b>¿Está listo para producción?</b></summary>

La API es estable en espíritu pero aún es pre-1.0. No garantizamos que no haya cambios disruptivos entre versiones minor antes de 1.0. Después de 1.0 seguimos semver estricto.

Para uso productivo hoy: fija la versión exacta (`"0.1.0"` en lugar de `"^0.1.0"`).
</details>

<details>
<summary><b>¿Cómo se relaciona con napi-rs?</b></summary>

`napi-rs` es el puente FFI que usamos para exponer tipos Rust a Node.js. El crate `crates/mc-node` contiene las anotaciones `#[napi]`; todo lo demás es Rust normal en `crates/mc-core`.
</details>

---

## 📜 Licencia

Licenciado bajo [Apache-2.0](LICENSE).

Copyright © 2025 [Brashkie](https://github.com/Brashkie). Todos los derechos reservados.

---

<div align="center">

**Hecho con 🦀 + ⚡ para la web multimedia moderna.**

[Sitio web](https://kryx.dev) · [Issues](https://github.com/Brashkie/media-core/issues) · [Discusiones](https://github.com/Brashkie/media-core/discussions)

</div>
