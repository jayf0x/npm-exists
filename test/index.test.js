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
  it('returns metadata for npm-exists itself', async () => {
    const result = await npmExists('npm-exists')
    expect(result).toBeTruthy()
    expect(result.name).toBe('npm-exists')
  }, 15000)

  it('returns false for a non-existent package', async () => {
    const result = await npmExists('this-package-xyz-does-not-exist-99999')
    expect(result).toBe(false)
  }, 15000)

  it('result includes dist-tags.latest', async () => {
    const result = await npmExists('npm-exists')
    expect(result['dist-tags']?.latest).toBeTypeOf('string')
  }, 15000)
})
