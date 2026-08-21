import { describe, expect, it } from 'vitest'
import { transformPostcodeLookup, transformPostcodeSuggestions } from '../transformLocations'

describe('transformPostcodeSuggestions', () => {
  it('maps postcodes to options with prefixed ids', () => {
    expect(
      transformPostcodeSuggestions({ status: 200, result: ['N1 7DP', 'N1 0QH'] }),
    ).toEqual([
      { id: 'pc:N1 7DP', label: 'N1 7DP' },
      { id: 'pc:N1 0QH', label: 'N1 0QH' },
    ])
  })

  it('treats a null result as no matches', () => {
    expect(transformPostcodeSuggestions({ status: 200, result: null })).toEqual([])
  })
})

describe('transformPostcodeLookup', () => {
  it('flattens the coordinates and joins the region', () => {
    expect(
      transformPostcodeLookup({
        status: 200,
        result: {
          postcode: 'N1 7DP',
          latitude: 51.5364,
          longitude: -0.0908,
          admin_district: 'Islington',
          country: 'England',
        },
      }),
    ).toEqual({
      postcode: 'N1 7DP',
      latitude: 51.5364,
      longitude: -0.0908,
      region: 'Islington, England',
    })
  })

  it('omits a null admin_district from the region', () => {
    expect(
      transformPostcodeLookup({
        status: 200,
        result: {
          postcode: 'BT1 1AA',
          latitude: 54.6,
          longitude: -5.93,
          admin_district: null,
          country: 'Northern Ireland',
        },
      }).region,
    ).toBe('Northern Ireland')
  })
})
