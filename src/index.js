const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

/**
 * Returns the registry URL for a package.
 * @param {string} pkg
 * @param {string} [registry]
 * @returns {string}
 */
export function getNpmUrl(pkg, registry = DEFAULT_REGISTRY) {
  return `${registry.replace(/\/$/, '')}/${encodeURIComponent(pkg)}`
}

/**
 * Checks if an npm package exists.
 * Returns package metadata on success, false if not found.
 * @param {string} pkg
 * @param {string} [registry]
 * @returns {Promise<object|false>}
 */
export async function npmExists(pkg, registry) {
  const url = getNpmUrl(pkg, registry)
  const res = await fetch(url)
  if (res.status === 404) return false
  if (!res.ok) throw new Error(`npm registry error: HTTP ${res.status}`)
  return res.json()
}

export default npmExists
