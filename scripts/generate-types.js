#!/usr/bin/env node
import { writeFileSync } from 'fs'

const dts = `export declare function getNpmUrl(pkg: string, registry?: string): string

export declare function npmExists(pkg: string, registry?: string): Promise<Record<string, unknown> | false>

export default npmExists
`

writeFileSync('dist/index.d.ts', dts)
console.log('✓ dist/index.d.ts generated')
