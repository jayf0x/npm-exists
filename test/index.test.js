import { describe, it, expect, vi, afterEach } from 'vitest'
import { npmExists, getNpmUrl } from '../src/index.js'

afterEach(() => vi.unstubAllGlobals())

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
  it('returns true for existing package', async () => {
    expect(await npmExists('@jayf0x/npm-exists')).toBe(true)
  }, 15000)

  it('returns false for non-existent package', async () => {
    expect(await npmExists('this-package-xyz-does-not-exist-99999')).toBe(false)
  }, 15000)

  it('accepts custom registry option', async () => {
    expect(await npmExists('react', { registry: 'https://registry.npmjs.org' })).toBe(true)
  }, 15000)

  it('silent mode returns boolean, never throws', async () => {
    const result = await npmExists('react', { silent: true })
    expect(typeof result).toBe('boolean')
  }, 15000)

  it('returns false for 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 404, ok: false }))
    expect(await npmExists('no-such-pkg')).toBe(false)
  })

  it('throws on registry error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 500, ok: false }))
    await expect(npmExists('react')).rejects.toThrow('HTTP 500')
  })

  it('silent mode swallows registry errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 500, ok: false }))
    expect(await npmExists('react', { silent: true })).toBe(false)
  })
})
