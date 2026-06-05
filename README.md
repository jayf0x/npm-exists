# npm-exists

> Check if an npm package name is taken. Zero dependencies, uses native `fetch`.

[![npm version](https://img.shields.io/npm/v/@jayf0x/npm-exists.svg)](https://npmjs.com/package/@jayf0x/npm-exists)
[![npm downloads](https://img.shields.io/npm/dm/@jayf0x/npm-exists.svg)](https://npmjs.com/package/@jayf0x/npm-exists)
[![license](https://img.shields.io/npm/l/@jayf0x/npm-exists.svg)](LICENSE)
[![node](https://img.shields.io/node/v/@jayf0x/npm-exists.svg)](package.json)

## Features

- **Zero dependencies** — uses native `fetch` (Node 18+)
- **Returns full metadata** — not just a boolean; get version, description, author, etc.
- **Custom registry** — point at any npm-compatible registry
- **CLI included** — `npm-exists <package-name>`
- **Dual ESM/CJS** — works in both module systems
- **TypeScript types** included

## Install

```sh
npm install @jayf0x/npm-exists
```

## Usage

### API

```js
import npmExists from '@jayf0x/npm-exists'

// Check if a package exists — returns metadata or false
const details = await npmExists('react')
if (details) {
  console.log(`react@${details['dist-tags'].latest} exists`)
} else {
  console.log('Package name is free!')
}
```

```js
// With a custom registry
const details = await npmExists('my-pkg', 'https://my.private.registry.io')
```

```js
// Build your own fetch — getNpmUrl lets you use axios, ky, etc.
import { getNpmUrl } from '@jayf0x/npm-exists'
import axios from 'axios'

const url = getNpmUrl('react')
const { data } = await axios.get(url)
```

### Exports

| Export | Description |
|---|---|
| `npmExists(pkg, registry?)` | Returns package metadata (`object`) or `false` |
| `getNpmUrl(pkg, registry?)` | Returns the registry URL for a package |

### CLI

```sh
# Global install
npm install -g npm-exists

npm-exists react
# ✓ react@19.1.0 exists on npm

npm-exists my-unique-package-name-xyz
# ✗ my-unique-package-name-xyz is not registered on npm

# Exit codes:  0 = exists,  1 = not found,  2 = bad usage

# Custom registry
npm-exists my-pkg https://my.private.registry.io
```

### One-off via npx

```sh
npx @jayf0x/npm-exists react
```

## API Reference

### `npmExists(pkg, registry?)`

| Param | Type | Default | Description |
|---|---|---|---|
| `pkg` | `string` | — | Package name (scoped names like `@scope/pkg` are supported) |
| `registry` | `string` | `https://registry.npmjs.org` | Registry base URL |

**Returns:** `Promise<object \| false>`
- `object` — full registry metadata (includes `name`, `dist-tags`, `versions`, `description`, …)
- `false` — package does not exist

**Throws** if the registry returns an unexpected non-404 error (network issue, auth failure, etc.).

---

### `getNpmUrl(pkg, registry?)`

Returns the full URL used to query the registry. Useful when you want to make the request yourself.

```js
getNpmUrl('react')
// → 'https://registry.npmjs.org/react'

getNpmUrl('@scope/pkg')
// → 'https://registry.npmjs.org/%40scope%2Fpkg'
```

## Requirements

Node 18+ (uses native `fetch`).

## License

MIT
