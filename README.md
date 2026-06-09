<div align="center">

# ⚠️ @brashkie/media-core — DEPRECATED ⚠️

</div>

> [!WARNING]
> ### This package has been moved to [`@kryxjs/core`](https://www.npmjs.com/package/@kryxjs/core)
>
> Development continues at **[`github.com/Brashkie/kryx-core`](https://github.com/Brashkie/kryx-core)**.
>
> No new features will be added here. Only critical security fixes (if any) until end of 2026.

---

## 🚀 Migrate now

```bash
npm uninstall @brashkie/media-core
npm install @kryxjs/core
```

Update your imports:

```diff
- import { MediaBuffer, Pipeline, MediaError } from '@brashkie/media-core'
+ import { MediaBuffer, Pipeline, MediaError } from '@kryxjs/core'
```

That's it. The public TypeScript API is **identical** — only the package name changes.

📖 **[Full migration guide](https://github.com/Brashkie/kryx-core/blob/main/docs/MIGRATION.md)**

---

## What's the difference?

| Aspect | `@brashkie/media-core@0.1.5` | `@kryxjs/core@0.1.0` |
|--------|------------------------------|----------------------|
| Status | 🔴 Deprecated | 🟢 Active development |
| Repo | `Brashkie/media-core` | [`Brashkie/kryx-core`](https://github.com/Brashkie/kryx-core) |
| Buffer types in napi | `Array<number>` (binding bug) | ✅ `Buffer \| Uint8Array` (correct) |
| TypeScript API | identical | identical |
| Future features | ❌ none | ✅ all new work happens here |

The successor package is part of the broader **[Kryx](https://github.com/Brashkie/kryx-core)** ecosystem — a modular alternative to FFmpeg for Node.js, organized under the `@kryxjs/*` scope.

---

## What changed technically?

The only functional difference vs `@brashkie/media-core@0.1.4` is the **Buffer type fix** in the napi binding.

Before (`@brashkie/media-core@0.1.4`) — ugly workaround:

```ts
const buf = MediaBuffer.video([1, 2, 3] as unknown as Buffer, 0)
const data = buf.data() as unknown as number[]
```

Now (`@kryxjs/core@0.1.0`) — natural and ergonomic:

```ts
const buf = MediaBuffer.video(Buffer.from([1, 2, 3]), 0)
const buf2 = MediaBuffer.video(new Uint8Array([1, 2, 3]), 0)
const data: Buffer = buf.data()
```

If you were already using `Buffer.from(...)` (the natural way), no code change needed — just update the import.

---

## Why the rename?

The `@kryxjs/*` scope groups all packages of the Kryx ecosystem together (`@kryxjs/core`, `@kryxjs/codecs`, `@kryxjs/codecs-opus`, etc.), making the ecosystem easier to discover and maintain.

`@brashkie/media-core` was the prototype name. `@kryxjs/core` is the production name.

---

## What did NOT change

- Public TypeScript API (every class, function, type, signature)
- `MediaError` hierarchy and all error kinds
- `Pipeline` builder pattern and all built-in stages
- `Timebase` / `Timestamp` semantics
- ESM + CJS dual format
- Per-platform native binaries (7 platforms)
- Node.js ≥18 requirement

---

## Status

- `@brashkie/media-core@0.1.5` is this **deprecation release** — same code as 0.1.4 with a deprecated README and CHANGELOG note.
- `@brashkie/media-core@0.1.4` is the last functional version (now also deprecated).
- Versions 0.1.0–0.1.3 were already deprecated as broken.
- No new features will land here. Only critical security fixes (if any) until end of 2026.

---

## Need help migrating?

[Open a discussion on the new repo](https://github.com/Brashkie/kryx-core/discussions) or [file an issue](https://github.com/Brashkie/kryx-core/issues).

---

<div align="center">

**👉 Go to [`@kryxjs/core`](https://www.npmjs.com/package/@kryxjs/core) 👈**

[English](README.md) · [Español](README.es.md)

</div>