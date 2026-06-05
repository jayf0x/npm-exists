#!/usr/bin/env node
import { writeFileSync } from 'fs'

const dts = `export declare function getNpmUrl(pkg: string, registry?: string): string

export interface NpmExistsOptions {
  registry?: string
  silent?: boolean
}

export declare function npmExists(
  pkg: string,
  registryOrOptions?: string | NpmExistsOptions,
  options?: Pick<NpmExistsOptions, 'silent'>
): Promise<string | false>

export default npmExists
`

writeFileSync('dist/index.d.ts', dts)
console.log('✓ dist/index.d.ts generated')
