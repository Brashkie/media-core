'use strict'
/**
 * Creates the per-platform npm package directories for napi artifacts.
 * Run automatically before `napi artifacts`.
 */

const { mkdirSync, writeFileSync, existsSync } = require('fs')
const { join } = require('path')

const ROOT = join(__dirname, '..')
const PKG  = require(join(ROOT, 'package.json'))

const PLATFORMS = [
  { name: 'win32-x64-msvc',   os: 'win32',  cpu: 'x64',   libc: null     },
  { name: 'win32-arm64-msvc', os: 'win32',  cpu: 'arm64', libc: null     },
  { name: 'darwin-x64',       os: 'darwin', cpu: 'x64',   libc: null     },
  { name: 'darwin-arm64',     os: 'darwin', cpu: 'arm64', libc: null     },
  { name: 'linux-x64-gnu',    os: 'linux',  cpu: 'x64',   libc: 'glibc'  },
  { name: 'linux-x64-musl',   os: 'linux',  cpu: 'x64',   libc: 'musl'   },
  { name: 'linux-arm64-gnu',  os: 'linux',  cpu: 'arm64', libc: 'glibc'  },
]

for (const platform of PLATFORMS) {
  const dir     = join(ROOT, 'npm', platform.name)
  const pkgName = `@brashkie/media-core-${platform.name}`

  mkdirSync(dir, { recursive: true })

  const platformPkg = {
    name: pkgName,
    version: PKG.version,
    description: `${PKG.description} (${platform.name})`,
    os: [platform.os],
    cpu: [platform.cpu],
    ...(platform.libc ? { libc: [platform.libc] } : {}),
    main: 'media-core.node',
    files: ['media-core.node'],
    license: PKG.license,
    repository: PKG.repository,
  }

  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify(platformPkg, null, 2) + '\n'
  )

  console.log(`✓ Created npm/${platform.name}/package.json`)
}

console.log('\n✓ All platform packages created')
