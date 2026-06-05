#!/usr/bin/env node
import { writeFileSync } from 'fs'

const dts = `export declare function getNpmUrl(pkg: string, registry?: string): string

export interface NpmExistsOptions {
  registry?: string
  /** Suppress errors — network/registry failures return false instead of throwing */
  silent?: boolean
  /** Fetch full registry metadata instead of a lightweight HEAD check */
  full?: boolean
}

/**
 * Checks if an npm package exists.
 * Returns the npm page URL by default, or full registry metadata with \`full: true\`.
 */
export declare function npmExists(
  pkg: string,
  registryOrOptions?: string | NpmExistsOptions,
  options?: Pick<NpmExistsOptions, 'silent' | 'full'>
): Promise<string | Record<string, unknown> | false>

export default npmExists
`

writeFileSync('dist/index.d.ts', dts)
console.log('✓ dist/index.d.ts generated')
