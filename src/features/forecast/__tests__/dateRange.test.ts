import { describe, expect, it } from 'vitest'
import { forecastRange, isoDate } from '../dateRange'

describe('dateRange', () => {
  it('formats a local ISO date', () => {
    expect(isoDate(new Date(2026, 8, 9, 23, 30))).toBe('2026-09-09')
  })

  it('returns a five-day range', () => {
    expect(forecastRange(new Date(2026, 7, 20))).toEqual({
      startDate: '2026-08-20',
      endDate: '2026-08-24',
    })
  })

  it('handles month and leap-year boundaries', () => {
    expect(forecastRange(new Date(2028, 1, 27))).toEqual({
      startDate: '2028-02-27',
      endDate: '2028-03-02',
    })
  })
})
