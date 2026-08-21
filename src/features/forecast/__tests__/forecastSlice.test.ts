import { describe, expect, it } from 'vitest'
import reducer, { setForecastArgs, setForecastPlace, setSelectedDate } from '../forecastSlice'

const args = {
  latitude: 51.45789,
  longitude: -2.58932,
  startDate: '2026-08-20',
  endDate: '2026-08-24',
}

describe('forecastSlice', () => {
  it('normalises forecast args and selects the start date', () => {
    const previous = reducer(undefined, setSelectedDate('2026-08-23'))
    const state = reducer(previous, setForecastArgs(args))

    expect(state.args).toEqual({
      latitude: 51.4579,
      longitude: -2.5893,
      startDate: '2026-08-20',
      endDate: '2026-08-24',
    })
    expect(state.selectedDate).toBe('2026-08-20')
  })

  it('stores the selected place without changing forecast args', () => {
    const withArgs = reducer(undefined, setForecastArgs(args))
    const state = reducer(withArgs, setForecastPlace({ name: 'Bristol', region: 'Bristol, England' }))

    expect(state.place).toEqual({ name: 'Bristol', region: 'Bristol, England' })
    expect(state.args).toBe(withArgs.args)
  })
})
