# Para agregar AL INICIO de tu CHANGELOG.md existente

# IMPORTANTE: Esta no es una versión completa del CHANGELOG. Es solo la nueva
# entrada [0.1.5] qe debes pegar al inicio (después del header "## [Unreleased]"
# o al inicio del archivo si no existe esa sección).

## [0.1.5] — 2026-06-08

### Deprecated

**This is a deprecation release. The package is moving to [`@kryxjs/core`](https://www.npmjs.com/package/@kryxjs/core).**

`@brashkie/media-core` is no longer actively maintained. Development continues at [`github.com/Brashkie/kryx-core`](https://github.com/Brashkie/kryx-core) under the new `@kryxjs/*` scope.

### Migration

```bash
npm uninstall @brashkie/media-core
npm install @kryxjs/core
```

```diff
- import { MediaBuffer, Pipeline, MediaError } from '@brashkie/media-core'
+ import { MediaBuffer, Pipeline, MediaError } from '@kryxjs/core'
```

The public TypeScript API is identical. The only functional improvement in `@kryxjs/core@0.1.0` is the **Buffer types fix** in the napi binding — `MediaBuffer.video()` and `MediaBuffer.audio()` now accept `Buffer | Uint8Array` directly (without the `Array<number>` cast that was needed in 0.1.4).

### Changed in this release

- `README.md` and `README.es.md` rewritten as deprecation notices pointing to `@kryxjs/core`.
- This CHANGELOG entry added.
- **No code changes.** The compiled binary is identical to 0.1.4.

### Status going forward

- 🔴 `@brashkie/media-core@0.1.5` — deprecated, this final release.
- 🔴 `@brashkie/media-core@0.1.4` — deprecated (was the last functional release).
- 🔴 `@brashkie/media-core@0.1.0..0.1.3` — already deprecated as broken.
- 🟢 `@kryxjs/core@0.1.0+` — active development, all new features.

No new features will land in `@brashkie/media-core`. Only critical security fixes (if any) until end of 2026.

---

[0.1.5]: https://github.com/Brashkie/media-core/releases/tag/v0.1.5