#!/usr/bin/env node
import { writeFileSync } from 'fs'

const dts = `export declare function getNpmUrl(pkg: string, registry?: string): string

export interface NpmExistsOptions {
  registry?: string
  /** Suppress errors — network/registry failures return false instead of throwing */
  silent?: boolean
}

/**
 * Checks if an npm package exists.
 * Returns the npm page URL, or false if not found.
 */
export declare function npmExists(
  pkg: string,
  registryOrOptions?: string | NpmExistsOptions,
  options?: NpmExistsOptions
): Promise<string | false>

export default npmExists
`

writeFileSync('dist/index.d.ts', dts)
console.log('✓ dist/index.d.ts generated')
