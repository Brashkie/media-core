/**
 * Global vitest setup — mocks the native addon for all tests.
 *
 * The native `.node` binary is built by `napi build` into the project root.
 * For unit tests we replace it with a pure-JS implementation so:
 *   1. Tests don't require building Rust first.
 *   2. Coverage isn't skewed by uncovered native types.
 *   3. Behavior is deterministic across platforms.
 */

import { vi } from 'vitest'

vi.mock('../index', () => {
  class JsTimestamp {
    readonly pts: number
    readonly isValid: boolean
    constructor(pts: number) {
      this.pts = pts
      this.isValid = pts !== Number.MIN_SAFE_INTEGER
    }
    static none(): JsTimestamp { return new JsTimestamp(Number.MIN_SAFE_INTEGER) }
    static zero(): JsTimestamp { return new JsTimestamp(0) }
  }

  class JsMediaBuffer {
    readonly pts: number
    readonly len: number
    readonly isEmpty: boolean
    readonly isKeyframe: boolean
    readonly isEos: boolean
    readonly mediaType: string
    readonly codecId: string
    private readonly _data: Buffer

    private constructor(
      data: Buffer,
      pts: number,
      mediaType: string,
      codecId: string,
      eos = false,
    ) {
      this._data = data
      this.pts = pts
      this.len = data.length
      this.isEmpty = data.length === 0
      this.isKeyframe = false
      this.isEos = eos
      this.mediaType = mediaType
      this.codecId = codecId
    }

    static video(data: Buffer | Uint8Array, pts: number): JsMediaBuffer {
      return new JsMediaBuffer(Buffer.from(data), pts, 'video', 'h264')
    }
    static audio(data: Buffer | Uint8Array, pts: number): JsMediaBuffer {
      return new JsMediaBuffer(Buffer.from(data), pts, 'audio', 'aac')
    }
    static eosVideo(): JsMediaBuffer {
      return new JsMediaBuffer(Buffer.alloc(0), 0, 'video', 'h264', true)
    }

    data(): Buffer { return this._data }
  }

  return {
    JsTimestamp,
    JsMediaBuffer,
    version: () => '0.1.0-mock',
  }
})
