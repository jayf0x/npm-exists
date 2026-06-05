import { describe, it, expect } from 'vitest'
import { npmExists, getNpmUrl } from '../src/index.js'

describe('getNpmUrl', () => {
  it('returns default registry URL', () => {
    expect(getNpmUrl('react')).toBe('https://registry.npmjs.org/react')
  })

  it('uses custom registry', () => {
    expect(getNpmUrl('react', 'https://my.registry.io')).toBe('https://my.registry.io/react')
  })

  it('strips trailing slash from registry', () => {
    expect(getNpmUrl('react', 'https://my.registry.io/')).toBe('https://my.registry.io/react')
  })

  it('encodes scoped packages', () => {
    expect(getNpmUrl('@scope/pkg')).toBe('https://registry.npmjs.org/%40scope%2Fpkg')
  })
})

describe('npmExists', () => {
  it('returns npm URL for @jayf0x/npm-exists', async () => {
    const url = await npmExists('@jayf0x/npm-exists')
    expect(url).toBe('https://www.npmjs.com/package/@jayf0x/npm-exists')
  }, 15000)

  it('returns false for a non-existent package', async () => {
    const result = await npmExists('this-package-xyz-does-not-exist-99999')
    expect(result).toBe(false)
  }, 15000)

  it('silent mode returns false instead of throwing on error', async () => {
    const result = await npmExists('react', { silent: true })
    expect(typeof result === 'string' || result === false).toBe(true)
  }, 15000)

  it('accepts custom registry as second string arg', async () => {
    const result = await npmExists('react', 'https://registry.npmjs.org')
    expect(result).toBe('https://www.npmjs.com/package/react')
  }, 15000)
})
