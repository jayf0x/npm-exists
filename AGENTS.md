# npm-exists — Agent Guide

## What this package does

`npm-exists` checks whether an npm package name is registered on the npm registry (or any compatible registry). Uses a lightweight HEAD request — no body transferred. Returns the npm page URL on success, `false` if not found.

## Quick usage for agents

```js
import npmExists, { getNpmUrl } from '@jayf0x/npm-exists'

// Returns URL string or false
const url = await npmExists('react')
// → 'https://www.npmjs.com/package/react' | false

// Build a URL for use with any HTTP client
const registryUrl = getNpmUrl('react') // https://registry.npmjs.org/react
```

## Key facts

- **Zero runtime dependencies** — native `fetch` only (Node 18+)
- **HEAD request** — no body transferred, just a status check
- **Returns `false`** (not an error) for HTTP 404
- **Throws** on unexpected errors (5xx, network failure) unless `silent: true`
- **Custom registry**: pass as second string arg or `{ registry }` option
- **Scoped packages** (`@scope/pkg`) supported

## Exports

| Name | Signature | Returns |
|------|-----------|---------|
| `npmExists` (default) | `(pkg, registryOrOptions?, options?) => Promise<string \| false>` | npm page URL or `false` |
| `getNpmUrl` | `(pkg, registry?) => string` | registry API URL |

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `registry` | `string` | `https://registry.npmjs.org` | Custom registry base URL |
| `silent` | `boolean` | `false` | Return `false` instead of throwing on error |

## CLI

```
npm-exists <package-name> [registry-url]
```

Exit codes: `0` = exists, `1` = not found, `2` = usage error.
