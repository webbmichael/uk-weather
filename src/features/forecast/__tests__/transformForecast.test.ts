import { describe, expect, it } from 'vitest'
import { transformForecast, type RawForecast } from '../transformForecast'

const raw: RawForecast = {
  current_units: {
    apparent_temperature: '°C',
    wind_speed_10m: 'km/h',
    relative_humidity_2m: '%',
    visibility: 'm',
  },
  current: {
    temperature_2m: 17.4,
    weather_code: 61,
    apparent_temperature: 16.1,
    wind_speed_10m: 9.3,
    relative_humidity_2m: 82,
    visibility: 8960,
  },
  hourly_units: { relative_humidity_2m: '%', visibility: 'm' },
  hourly: {
    time: ['2026-08-20T11:00', '2026-08-20T12:00', '2026-08-21T12:00'],
    relative_humidity_2m: [61, 58, 72],
    visibility: [21000, 23500, 12000],
  },
  daily_units: { apparent_temperature_max: '°C', wind_speed_10m_max: 'km/h' },
  daily: {
    time: ['2026-08-20', '2026-08-21'],
    weather_code: [3, 61],
    temperature_2m_max: [21.2, 18.9],
    temperature_2m_min: [12.6, 11.1],
    apparent_temperature_max: [20, 18],
    apparent_temperature_min: [10, 8],
    wind_speed_10m_max: [14.8, 22.3],
  },
}

describe('transformForecast', () => {
  it('maps daily and midday data by date', () => {
    const forecast = transformForecast(raw)

    expect(forecast.dates).toEqual(['2026-08-20', '2026-08-21'])
    expect(forecast.byDate['2026-08-20']).toEqual({
      weatherCode: 3,
      tempMax: 21.2,
      tempMin: 12.6,
      feelsLike: 15,
      windSpeed: 14.8,
      humidity: 58,
      visibility: 23.5,
    })
  })

  it('returns null when midday data is missing', () => {
    const withoutMidday: RawForecast = {
      ...raw,
      hourly: {
        time: ['2026-08-20T09:00'],
        relative_humidity_2m: [61],
        visibility: [21000],
      },
    }

    const day = transformForecast(withoutMidday).byDate['2026-08-20']

    expect(day.humidity).toBeNull()
    expect(day.visibility).toBeNull()
  })

  it('maps the live reading separately from the daily summary', () => {
    const forecast = transformForecast(raw)

    // The daily entry for the same date averages max/min and samples midday,
    // so these must not collapse into each other.
    expect(forecast.current).toEqual({
      weatherCode: 61,
      temperature: 17.4,
      feelsLike: 16.1,
      windSpeed: 9.3,
      humidity: 82,
      visibility: 9,
    })
  })

  it('maps API units to forecast units', () => {
    const forecast = transformForecast(raw)

    expect(forecast.dayUnits).toEqual({
      feelsLike: '°C',
      windSpeed: 'km/h',
      humidity: '%',
      visibility: ' km',
    })
    expect(forecast.currentUnits).toEqual({
      feelsLike: '°C',
      windSpeed: 'km/h',
      humidity: '%',
      visibility: ' km',
    })
  })
})
