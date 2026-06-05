const DEFAULT_REGISTRY = 'https://registry.npmjs.org'
const NPM_PAGE_BASE = 'https://www.npmjs.com/package'

/**
 * Returns the registry API URL for a package.
 * @param {string} pkg
 * @param {string} [registry]
 * @returns {string}
 */
export function getNpmUrl(pkg, registry = DEFAULT_REGISTRY) {
  return `${registry.replace(/\/$/, '')}/${encodeURIComponent(pkg)}`
}

function getPageUrl(pkg, registry) {
  const base = (!registry || registry === DEFAULT_REGISTRY)
    ? NPM_PAGE_BASE
    : `${registry.replace(/\/$/, '')}/package`
  return `${base}/${pkg}`
}

/**
 * Checks if an npm package exists.
 *
 * By default uses HEAD (lightweight — no body transferred).
 * Pass `full: true` to fetch the full registry metadata instead.
 *
 * @param {string} pkg
 * @param {string | { registry?: string, silent?: boolean, full?: boolean }} [registryOrOptions]
 * @param {{ silent?: boolean, full?: boolean }} [options]
 * @returns {Promise<string | Record<string, unknown> | false>}
 */
export async function npmExists(pkg, registryOrOptions, options) {
  let registry = DEFAULT_REGISTRY
  let silent = false
  let full = false

  if (typeof registryOrOptions === 'string') {
    registry = registryOrOptions
    silent = options?.silent ?? false
    full = options?.full ?? false
  } else if (registryOrOptions != null) {
    registry = registryOrOptions.registry ?? DEFAULT_REGISTRY
    silent = registryOrOptions.silent ?? false
    full = registryOrOptions.full ?? false
  }

  try {
    const res = await fetch(getNpmUrl(pkg, registry), {
      method: full ? 'GET' : 'HEAD',
    })
    if (res.status === 404) return false
    if (!res.ok) throw new Error(`npm registry error: HTTP ${res.status}`)
    return full ? res.json() : getPageUrl(pkg, registry)
  } catch (err) {
    if (silent) return false
    throw err
  }
}

export default npmExists
