#!/usr/bin/env node
// Adds extensionless export aliases to @noble/ciphers v2 so the
// CJS imports in @ecies/ciphers (e.g. require('@noble/ciphers/utils'))
// resolve correctly. Without this the OpenNext build crashes because
// dotenvx -> eciesjs -> @ecies/ciphers tries to import 1.x-style paths.
const fs = require('node:fs')
const path = require('node:path')

const targets = []
function walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const name of fs.readdirSync(dir)) {
    if (name === '.bin' || name === '.cache') continue
    const full = path.join(dir, name)
    let stat
    try {
      stat = fs.statSync(full)
    } catch {
      continue
    }
    if (!stat.isDirectory()) continue
    if (name === '@noble') {
      const ciphers = path.join(full, 'ciphers', 'package.json')
      if (fs.existsSync(ciphers)) targets.push(ciphers)
    } else if (name === 'node_modules' || name.startsWith('@')) {
      walk(full)
    } else {
      const nested = path.join(full, 'node_modules')
      if (fs.existsSync(nested)) walk(nested)
    }
  }
}

walk(path.resolve(__dirname, '..', 'node_modules'))

let patched = 0
for (const pkgPath of targets) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  if (!pkg.version || !pkg.version.startsWith('2.')) continue
  if (!pkg.exports || typeof pkg.exports !== 'object') continue

  let changed = false
  for (const key of Object.keys({ ...pkg.exports })) {
    if (key.endsWith('.js')) {
      const alias = key.slice(0, -3) // drop ".js"
      if (alias !== '.' && !(alias in pkg.exports)) {
        pkg.exports[alias] = pkg.exports[key]
        changed = true
      }
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    patched++
  }
}

if (patched > 0) {
  console.log(`[patch-noble-ciphers] added extensionless aliases to ${patched} @noble/ciphers v2 install(s)`)
}
