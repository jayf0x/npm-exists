# npm-exists

```
⚡ HEAD → 200? true. 404? false. Done.
```

[![npm version](https://img.shields.io/npm/v/@jayf0x/npm-exists)](https://www.npmjs.com/package/@jayf0x/npm-exists)
[![npm downloads](https://img.shields.io/npm/dm/@jayf0x/npm-exists)](https://www.npmjs.com/package/@jayf0x/npm-exists)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@jayf0x/npm-exists)](https://bundlephobia.com/package/@jayf0x/npm-exists)
[![license](https://img.shields.io/npm/l/@jayf0x/npm-exists)](./LICENSE)

The simplest, fastest possible npm package existence check. One HEAD request. No body. No regex. No deps.

## Install

```sh
npm install @jayf0x/npm-exists
```

## Usage

```js
import npmExists from '@jayf0x/npm-exists'

await npmExists('react')      // true
await npmExists('not-a-pkg')  // false
```

```js
// Custom registry
await npmExists('my-pkg', { registry: 'https://my.private.registry.io' })

// Suppress network errors
await npmExists('react', { silent: true })
```

```js
// Get the registry URL (useful with axios, ky, etc.)
import { getNpmUrl } from '@jayf0x/npm-exists'
getNpmUrl('react')        // 'https://registry.npmjs.org/react'
getNpmUrl('@types/node')  // 'https://registry.npmjs.org/%40types%2Fnode'
```

## CLI

```sh
npx @jayf0x/npm-exists react
# ✓ react exists on npm

npm-exists my-pkg
# ✗ my-pkg is not registered on npm
```

Exit codes: `0` exists · `1` not found · `2` bad usage

## API

### `npmExists(pkg, options?)`

| Param | Type | Default | Description |
|---|---|---|---|
| `pkg` | `string` | — | Package name |
| `options.registry` | `string` | `'https://registry.npmjs.org'` | Custom registry URL |
| `options.silent` | `boolean` | `false` | Return `false` on errors instead of throwing |

Returns `Promise<boolean>`

### `getNpmUrl(pkg, registry?)`

Returns the registry API URL. Use this directly with your own HTTP client.

## License

MIT
