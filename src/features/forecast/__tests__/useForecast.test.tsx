// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { describe, expect, it } from 'vitest'
import { createStore } from '../../../app/store'
import type {
  CurrentConditions,
  DayForecast,
  Forecast,
  ForecastArgs,
} from '../../../types/forecast'
import { forecastApi } from '../forecastApi'
import { setForecastArgs, setSelectedDate } from '../forecastSlice'
import { useForecast } from '../useForecast'

const args: ForecastArgs = {
  latitude: 51.4579,
  longitude: -2.5893,
  startDate: '2026-08-20',
  endDate: '2026-08-24',
}

const day = (tempMax: number): DayForecast => ({
  weatherCode: 3,
  tempMax,
  tempMin: tempMax - 8,
  feelsLike: tempMax - 2,
  windSpeed: 12,
  humidity: 60,
  visibility: 24,
})

const current: CurrentConditions = {
  weatherCode: 61,
  temperature: 21.4,
  feelsLike: 20,
  windSpeed: 7,
  humidity: 81,
  visibility: 9,
}

const forecast: Forecast = {
  current,
  dates: ['2026-08-20', '2026-08-21'],
  byDate: { '2026-08-20': day(23), '2026-08-21': day(18) },
  dayUnits: { feelsLike: '°C', windSpeed: 'km/h' },
  currentUnits: { feelsLike: '°C', windSpeed: 'mph' },
}

const renderForecast = (store: ReturnType<typeof createStore>) =>
  renderHook(() => useForecast(), {
    wrapper: ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>,
  })

describe('useForecast', () => {
  it('stays idle until a location is selected', () => {
    const { result } = renderForecast(createStore())

    expect(result.current.data).toBeUndefined()
    expect(result.current.selectedDay).toBeUndefined()
    expect(result.current.isToday).toBe(false)
  })

  it('returns the selected forecast day', async () => {
    const store = createStore()
    store.dispatch(setForecastArgs(args))
    await store.dispatch(forecastApi.util.upsertQueryData('getForecast', args, forecast))

    const { result } = renderForecast(store)

    expect(result.current.selectedDay).toEqual(day(23))
    expect(result.current.isToday).toBe(true)

    act(() => {
      store.dispatch(setSelectedDate('2026-08-21'))
    })

    expect(result.current.selectedDay).toEqual(day(18))
    expect(result.current.isToday).toBe(false)
  })

  it('serves the live reading for today and the daily summary for later days', async () => {
    const store = createStore()
    store.dispatch(setForecastArgs(args))
    await store.dispatch(forecastApi.util.upsertQueryData('getForecast', args, forecast))

    const { result } = renderForecast(store)

    expect(result.current.metrics).toEqual(current)
    expect(result.current.metricUnits).toEqual({ feelsLike: '°C', windSpeed: 'mph' })

    act(() => {
      store.dispatch(setSelectedDate('2026-08-21'))
    })

    expect(result.current.metrics).toEqual(day(18))
    expect(result.current.metricUnits).toEqual({ feelsLike: '°C', windSpeed: 'km/h' })
  })
})
