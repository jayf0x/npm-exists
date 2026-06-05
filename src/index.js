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
 * Returns the npm package URL on success, false if not found.
 *
 * @param {string} pkg
 * @param {string | { registry?: string, silent?: boolean }} [registryOrOptions]
 * @param {{ silent?: boolean }} [options]
 * @returns {Promise<string|false>}
 */
export async function npmExists(pkg, registryOrOptions, options) {
  let registry = DEFAULT_REGISTRY
  let silent = false

  if (typeof registryOrOptions === 'string') {
    registry = registryOrOptions
    silent = options?.silent ?? false
  } else if (registryOrOptions != null) {
    registry = registryOrOptions.registry ?? DEFAULT_REGISTRY
    silent = registryOrOptions.silent ?? false
  }

  try {
    const res = await fetch(getNpmUrl(pkg, registry))
    if (res.status === 404) return false
    if (!res.ok) throw new Error(`npm registry error: HTTP ${res.status}`)
    return getPageUrl(pkg, registry)
  } catch (err) {
    if (silent) return false
    throw err
  }
}

export default npmExists
