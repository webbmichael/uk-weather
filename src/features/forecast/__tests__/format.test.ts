import { describe, expect, it } from 'vitest'
import { dayLabel, weatherLabel } from '../format'

describe('format', () => {
  it('formats weather codes', () => {
    expect(weatherLabel(0)).toBe('Clear sky')
    expect(weatherLabel(95)).toBe('Thunderstorm')
    expect(weatherLabel(-1)).toBe('Unknown conditions')
  })


  it('formats forecast day labels', () => {
    const today = new Date(2026, 7, 20)

    expect(dayLabel('2026-08-20', today)).toBe('TODAY')
    expect(dayLabel('2026-08-21', today)).toBe('FRI 21 AUG')
  })
})
