'use strict'
/**
 * Sync version across:
 *  - root package.json (source of truth)
 *  - crates/mc-node/package.json
 *  - all optionalDependencies entries in root package.json
 *
 * Called automatically by npm version (via the "version" lifecycle script).
 */

const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')

const ROOT = join(__dirname, '..')
const ROOT_PKG_PATH = join(ROOT, 'package.json')
const ROOT_PKG = JSON.parse(readFileSync(ROOT_PKG_PATH, 'utf8'))

const VERSION = ROOT_PKG.version
console.log(`syncing version → ${VERSION}`)

// Update optionalDependencies
if (ROOT_PKG.optionalDependencies) {
  for (const dep of Object.keys(ROOT_PKG.optionalDependencies)) {
    if (dep.startsWith('@brashkie/media-core-')) {
      ROOT_PKG.optionalDependencies[dep] = VERSION
    }
  }
  writeFileSync(ROOT_PKG_PATH, JSON.stringify(ROOT_PKG, null, 2) + '\n')
  console.log(`  ✓ updated root package.json optionalDependencies`)
}

// Update mc-node package.json
const MCNODE_PKG_PATH = join(ROOT, 'crates', 'mc-node', 'package.json')
const MCNODE_PKG = JSON.parse(readFileSync(MCNODE_PKG_PATH, 'utf8'))
MCNODE_PKG.version = VERSION
writeFileSync(MCNODE_PKG_PATH, JSON.stringify(MCNODE_PKG, null, 2) + '\n')
console.log(`  ✓ updated crates/mc-node/package.json`)

console.log('done.')
