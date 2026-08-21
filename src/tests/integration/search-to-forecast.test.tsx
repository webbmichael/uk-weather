// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createStore } from '../../app/store'
import { WeatherPage } from '../../pages/Weather'

const TODAY = new Date(2026, 7, 20)
const DATE = '2026-08-20'

vi.stubGlobal(
  'fetch',
  vi.fn((input: RequestInfo | URL) => {
    const url = input instanceof Request ? input.url : String(input)

    const data = url.includes('geocoding-api')
      ? {
          results: [
            {
              id: 1,
              name: 'Bristol',
              latitude: 51.45,
              longitude: -2.59,
              admin1: 'England',
              admin2: 'City of Bristol',
              country: 'United Kingdom',
            },
          ],
        }
      : url.includes('/autocomplete')
      ? { status: 200, result: ['N1 7DP', 'N1 0QH'] }
      : url.includes('postcodes.io')
      ? {
          status: 200,
          result: {
            postcode: 'N1 7DP',
            latitude: 51.54,
            longitude: -0.09,
            admin_district: 'Islington',
            country: 'England',
          },
        }
      : {
          current_units: {
            apparent_temperature: '°C',
            wind_speed_10m: 'km/h',
            relative_humidity_2m: '%',
            visibility: 'm',
          },
          current: {
            temperature_2m: 21,
            weather_code: 3,
            apparent_temperature: 19,
            wind_speed_10m: 11,
            relative_humidity_2m: 64,
            visibility: 30240,
          },
          hourly_units: { relative_humidity_2m: '%', visibility: 'm' },
          hourly: {
            time: [`${DATE}T12:00`],
            relative_humidity_2m: [58],
            visibility: [24000],
          },
          daily_units: { apparent_temperature_max: '°C', wind_speed_10m_max: 'km/h' },
          daily: {
            time: [DATE],
            weather_code: [3],
            temperature_2m_max: [23],
            temperature_2m_min: [13],
            apparent_temperature_max: [22],
            apparent_temperature_min: [12],
            wind_speed_10m_max: [15],
          },
        }

    return Promise.resolve(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  }),
)

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(TODAY)
})

afterEach(() => vi.useRealTimers())

describe('WeatherPage', () => {
  it('shows weather for a selected location', async () => {
    const user = userEvent.setup()

    render(
      <Provider store={createStore()}>
        <WeatherPage />
      </Provider>,
    )

    await user.type(screen.getByRole('combobox'), 'Bristol')
    await user.click(await screen.findByRole('option'))

    const hero = (await screen.findByRole('heading', { name: 'Bristol' })).closest('section')!


    expect(await within(hero).findByText('21°')).toBeTruthy()
    expect(within(hero).getByText('Overcast')).toBeTruthy()
    expect(screen.getByRole('button', { name: /TODAY/ })).toBeTruthy()

    const metrics = screen.getByText('FEELS LIKE').closest('div')!.parentElement!
    expect(within(metrics).getByText('19°C')).toBeTruthy()
    expect(within(metrics).getByText('11km/h')).toBeTruthy()
    expect(within(metrics).getByText('64%')).toBeTruthy()
    expect(within(metrics).getByText('30.2 km')).toBeTruthy()
  })

  it('shows weather for a selected postcode', async () => {
    const user = userEvent.setup()

    render(
      <Provider store={createStore()}>
        <WeatherPage />
      </Provider>,
    )

    await user.type(screen.getByRole('combobox'), 'N1')
    await user.click(await screen.findByRole('option', { name: /N1 7DP/ }))

    const hero = (await screen.findByRole('heading', { name: 'N1 7DP' })).closest('section')!

    expect(await within(hero).findByText('21°')).toBeTruthy()
    expect(within(hero).getByText('Islington, England')).toBeTruthy()

    const forecastCalls = vi
      .mocked(fetch)
      .mock.calls.map(([input]) => (input instanceof Request ? input.url : String(input)))
      .filter((u) => u.includes('api.open-meteo.com'))
    expect(
      forecastCalls.some((u) => u.includes('latitude=51.54') && u.includes('longitude=-0.09')),
    ).toBe(true)
  })
})
