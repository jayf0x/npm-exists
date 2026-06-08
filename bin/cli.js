#!/usr/bin/env node
import { npmExists } from '../dist/index.js'

const [pkg, registry] = process.argv.slice(2)

if (!pkg) {
  console.error('Usage: npm-exists <package-name> [registry-url]')
  process.exit(2)
}

const exists = await npmExists(pkg, registry ? { registry } : {})

if (exists) {
  console.log(`✓ ${pkg} exists on npm`)
  process.exit(0)
} else {
  console.log(`✗ ${pkg} is not registered on npm`)
  process.exit(1)
}
