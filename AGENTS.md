# npm-exists — Agent Guide

## What this package does

`npm-exists` checks whether an npm package name is registered on the npm registry (or any compatible registry). It returns the full package metadata on success, or `false` if the package does not exist.

## Quick usage for agents

```js
import npmExists, { getNpmUrl } from '@jayf0x/npm-exists'

// Check existence + get metadata
const result = await npmExists('react')
// result → { name, description, 'dist-tags': { latest: '19.1.0' }, versions, ... } | false

// Build a URL for use with any HTTP client
const url = getNpmUrl('react') // https://registry.npmjs.org/react
```

## Key facts

- **Zero runtime dependencies** — only needs native `fetch` (Node 18+)
- **Returns `false`** (not an error) when a package does not exist (HTTP 404)
- **Throws** on unexpected registry errors (5xx, network failure, etc.)
- **Custom registry**: pass a second argument to both `npmExists` and `getNpmUrl`
- **Scoped packages** (`@scope/pkg`) are supported — the name is `encodeURIComponent`-encoded in the URL

## Exports

| Name | Signature | Returns |
|------|-----------|---------|
| `npmExists` (default) | `(pkg: string, registry?: string) => Promise<object \| false>` | metadata or `false` |
| `getNpmUrl` | `(pkg: string, registry?: string) => string` | registry URL |

## CLI

```
npm-exists <package-name> [registry-url]
```

Exit codes: `0` = exists, `1` = not found, `2` = usage error.
