/**
 * Placeholder native loader.
 *
 * This file is overwritten by `napi build`. It exists so that imports
 * resolve before the native `.node` binary is built (for `tsc --noEmit`,
 * IDE language servers, etc).
 *
 * After running `npm run build:native:debug` (or `build:native`), this
 * file is replaced with the real napi-rs loader.
 */
'use strict'

const stub = {
  JsTimestamp: class {
    constructor() {
      throw new Error(
        '[@brashkie/media-core] native addon not built yet. ' +
          "Run: npm run build:native:debug"
      )
    }
    static none() { return new this() }
    static zero() { return new this() }
  },
  JsMediaBuffer: class {
    constructor() {
      throw new Error(
        '[@brashkie/media-core] native addon not built yet. ' +
          "Run: npm run build:native:debug"
      )
    }
    static video() { return new this() }
    static audio() { return new this() }
    static eosVideo() { return new this() }
  },
  version: () => '0.0.0-stub',
}

// Try to load the real native binary; fall back to the stub.
try {
  // The real loader is injected by `napi build` and uses a complex platform
  // dispatch. If we're running the placeholder, this require will throw.
  module.exports = require('./media-core.node')
} catch {
  module.exports = stub
}
