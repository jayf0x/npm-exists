#!/usr/bin/env node
import { npmExists } from '../dist/index.js'

const [pkg, registry] = process.argv.slice(2)

if (!pkg) {
  console.error('Usage: npm-exists <package-name> [registry-url]')
  process.exit(2)
}

const result = await npmExists(pkg, registry)

if (result) {
  const version = result['dist-tags']?.latest ?? '?'
  console.log(`✓ ${pkg}@${version} exists on npm`)
  process.exit(0)
} else {
  console.log(`✗ ${pkg} is not registered on npm`)
  process.exit(1)
}
