/**
 * Placeholder native addon entry.
 *
 * This file is overwritten by `napi build`. It exists so that resolution
 * doesn't fail before the native `.node` binary is built.
 */
'use strict'

try {
  // napi generates the real loader here
  module.exports = require('./media-core.node')
} catch (err) {
  throw new Error(
    'Native addon not built yet. Run: npm run build:native:debug\n' +
      'Original error: ' + (err && err.message)
  )
}
