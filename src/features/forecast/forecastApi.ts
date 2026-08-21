import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Forecast, ForecastArgs } from '../../types/forecast';
import { transformForecast } from './transformForecast';

export const forecastApi = createApi({
  reducerPath: 'forecastApi',
  keepUnusedDataFor: 300, // 5 minutes (seconds)
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.open-meteo.com/v1/' }),
  endpoints: (build) => ({
    getForecast: build.query<Forecast, ForecastArgs>({
      query: ({ latitude, longitude, startDate, endDate }) => ({
        url: 'forecast',
        params: {
          latitude,
          longitude,
          current:
            'temperature_2m,weather_code,apparent_temperature,wind_speed_10m,relative_humidity_2m,visibility',
          daily:
            'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max',
          hourly: 'relative_humidity_2m,visibility',
          timezone: 'auto',
          start_date: startDate,
          end_date: endDate,
        },
      }),
      transformResponse: transformForecast,
    }),
  }),
});

export const { useGetForecastQuery } = forecastApi;
