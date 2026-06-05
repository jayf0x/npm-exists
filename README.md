# npm-exists

> Check if an npm package name is taken.

[![npm version](https://img.shields.io/npm/v/@jayf0x/npm-exists)](https://www.npmjs.com/package/@jayf0x/npm-exists)
[![npm downloads](https://img.shields.io/npm/dm/@jayf0x/npm-exists)](https://www.npmjs.com/package/@jayf0x/npm-exists)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@jayf0x/npm-exists)](https://bundlephobia.com/package/@jayf0x/npm-exists)
[![license](https://img.shields.io/npm/l/@jayf0x/npm-exists)](./LICENSE)

Zero dependencies. Returns the npm package URL or `false`.

## Install

```sh
npm install @jayf0x/npm-exists
```

## Usage

```js
import npmExists from '@jayf0x/npm-exists'

const url = await npmExists('react')
// 'https://www.npmjs.com/package/react' | false
```

```js
// Custom registry
const url = await npmExists('my-pkg', 'https://my.private.registry.io')
```

```js
// Suppress errors (network failures return false instead of throwing)
const url = await npmExists('react', { silent: true })
```

```js
// Full metadata (GET instead of HEAD)
const meta = await npmExists('react', { full: true })
// → { name, description, 'dist-tags', versions, ... } | false
```

```js
// Build your own fetch
import { getNpmUrl } from '@jayf0x/npm-exists'
const url = getNpmUrl('react') // https://registry.npmjs.org/react
```

## CLI

```sh
npx @jayf0x/npm-exists react
# ✓ react@19.1.0 exists on npm

npm-exists my-pkg https://my.private.registry.io
```

Exit codes: `0` exists · `1` not found · `2` bad usage

## API

### `npmExists(pkg, registryOrOptions?, options?)`

| Param | Type | Description |
|---|---|---|
| `pkg` | `string` | Package name |
| `registryOrOptions` | `string \| { registry?, silent?, full? }` | Registry URL or options object |
| `options` | `{ silent?, full? }` | `silent`: errors → `false`; `full`: GET full metadata instead of HEAD |

Returns `Promise<string \| Record<string, unknown> \| false>`

### `getNpmUrl(pkg, registry?)`

Returns the registry API URL. Useful with custom HTTP clients like axios or ky.

## License

MIT
