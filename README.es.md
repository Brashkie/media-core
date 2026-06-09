<div align="center">

# ⚠️ @brashkie/media-core — OBSOLETO ⚠️

</div>

> [!WARNING]
> ### Este paquete fue movido a [`@kryxjs/core`](https://www.npmjs.com/package/@kryxjs/core)
>
> El desarrollo continúa en **[`github.com/Brashkie/kryx-core`](https://github.com/Brashkie/kryx-core)**.
>
> Aquí no se agregarán nuevas funcionalidades. Solo correcciones críticas de seguridad (si surgen) hasta fines de 2026.

---

## 🚀 Migra ahora

```bash
npm uninstall @brashkie/media-core
npm install @kryxjs/core
```

Actualiza tus imports:

```diff
- import { MediaBuffer, Pipeline, MediaError } from '@brashkie/media-core'
+ import { MediaBuffer, Pipeline, MediaError } from '@kryxjs/core'
```

Eso es todo. La API pública de TypeScript es **idéntica** — solo cambia el nombre del paquete.

📖 **[Guía completa de migración](https://github.com/Brashkie/kryx-core/blob/main/docs/MIGRATION.md)**

---

## ¿Cuál es la diferencia?

| Aspecto | `@brashkie/media-core@0.1.4` | `@kryxjs/core@0.1.0` |
|---------|------------------------------|----------------------|
| Estado | 🔴 Obsoleto | 🟢 Desarrollo activo |
| Repositorio | `Brashkie/media-core` | [`Brashkie/kryx-core`](https://github.com/Brashkie/kryx-core) |
| Tipos Buffer en napi | `Array<number>` (bug del binding) | ✅ `Buffer \| Uint8Array` (correcto) |
| API TypeScript | idéntica | idéntica |
| Funcionalidades futuras | ❌ ninguna | ✅ todo el trabajo nuevo está aquí |

El paquete sucesor es parte del ecosistema más amplio **[Kryx](https://github.com/Brashkie/kryx-core)** — una alternativa modular a FFmpeg para Node.js, organizada bajo el scope `@kryxjs/*`.

---

## ¿Por qué el cambio de nombre?

El scope `@kryxjs/*` agrupa todos los paquetes del ecosistema Kryx juntos (`@kryxjs/core`, `@kryxjs/codecs`, `@kryxjs/codecs-opus`, etc.), haciendo el ecosistema más fácil de descubrir y mantener.

`@brashkie/media-core` era el nombre del prototipo. `@kryxjs/core` es el nombre de producción.

---

## ¿Qué cambió técnicamente?

El único cambio funcional respecto a `@brashkie/media-core@0.1.4` es el **fix de los tipos Buffer** en el binding nativo de napi-rs.

Antes (`@brashkie/media-core@0.1.4`) — workaround feo:

```ts
const buf = MediaBuffer.video([1, 2, 3] as unknown as Buffer, 0)
const data = buf.data() as unknown as number[]
```

Ahora (`@kryxjs/core@0.1.0`) — natural y ergonómico:

```ts
const buf = MediaBuffer.video(Buffer.from([1, 2, 3]), 0)
const buf2 = MediaBuffer.video(new Uint8Array([1, 2, 3]), 0)
const data: Buffer = buf.data()
```

Si ya usabas `Buffer.from(...)` (la forma natural), no necesitas cambiar nada en tu código — solo actualiza el import.

---

## Lo que **NO** cambió

- API pública de TypeScript (cada clase, función, tipo y firma)
- Jerarquía de `MediaError` y todos los tipos de error
- Patrón builder de `Pipeline` y todas las stages built-in
- Semántica de `Timebase` / `Timestamp`
- Formato dual ESM + CJS
- Binarios nativos por plataforma (7 plataformas)
- Requerimiento de Node.js ≥18

---

## Estado de `@brashkie/media-core`

- `@brashkie/media-core@0.1.4` es la **última versión funcional**.
- Está **obsoleta** en npm con un aviso que apunta a `@kryxjs/core`.
- **No** recibirá nuevas funcionalidades. Solo correcciones críticas de seguridad (si surgen) hasta fines de 2026.
- Las versiones 0.1.0–0.1.3 ya estaban obsoletas como rotas.

---

## ¿Necesitas ayuda para migrar?

[Abre una discusión en el nuevo repositorio](https://github.com/Brashkie/kryx-core/discussions) o [reporta un issue](https://github.com/Brashkie/kryx-core/issues).

---

<div align="center">

**👉 Ve a [`@kryxjs/core`](https://www.npmjs.com/package/@kryxjs/core) 👈**

[English README](README.md) · **Español**

</div>