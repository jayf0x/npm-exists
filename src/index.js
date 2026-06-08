const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

/**
 * Returns the registry API URL for a package.
 * @param {string} pkg
 * @param {string} [registry]
 * @returns {string}
 */
export function getNpmUrl(pkg, registry = DEFAULT_REGISTRY) {
  const base = registry.endsWith('/') ? registry : `${registry}/`
  return new URL(encodeURIComponent(pkg), base).toString()
}

/**
 * Checks if an npm package exists via a lightweight HEAD request.
 *
 * @param {string} pkg - Package name (e.g. 'react' or '@types/node')
 * @param {Object} [options]
 * @param {string} [options.registry] - Custom npm registry URL
 * @param {boolean} [options.silent=false] - Return false on network errors instead of throwing
 * @returns {Promise<boolean>}
 */
export async function npmExists(pkg, options = {}) {
  const {
    registry = DEFAULT_REGISTRY,
    silent = false,
  } = options

  try {
    const res = await fetch(getNpmUrl(pkg, registry), { method: 'HEAD' })
    if (res.status === 404) return false
    if (!res.ok) throw new Error(`npm registry error: HTTP ${res.status}`)
    return true
  } catch (err) {
    if (silent) return false
    throw err
  }
}

export default npmExists
