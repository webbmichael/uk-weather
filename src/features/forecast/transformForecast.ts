import type {
  CurrentConditions,
  DayForecast,
  Forecast,
  MetricUnits,
} from '../../types/forecast';

export interface RawForecast {
  current_units: Record<string, string>;
  current: {
    temperature_2m: number;
    weather_code: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    visibility: number;
  };
  hourly_units: Record<string, string>;
  hourly: {
    time: string[];
    relative_humidity_2m: number[];
    visibility: number[];
  };
  daily_units: Record<string, string>;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    wind_speed_10m_max: number[];
  };
}

const VISIBILITY_UNIT = ' km';
const visibilityKm = (metres: number) => Number((metres / 1000).toFixed(1));

export const transformForecast = (raw: RawForecast): Forecast => {
  const hourlyIndexByTime: Record<string, number> = {};
  raw.hourly.time.forEach((time, i) => {
    hourlyIndexByTime[time] = i;
  });

  const byDate: Record<string, DayForecast> = {};
  raw.daily.time.forEach((date, i) => {
    const middayIndex = hourlyIndexByTime[`${date}T12:00`];
    byDate[date] = {
      weatherCode: raw.daily.weather_code[i],
      tempMax: raw.daily.temperature_2m_max[i],
      tempMin: raw.daily.temperature_2m_min[i],
      feelsLike: (raw.daily.apparent_temperature_max[i] + raw.daily.apparent_temperature_min[i]) / 2,
      humidity: middayIndex != null ? raw.hourly.relative_humidity_2m[middayIndex] : null,
      visibility: middayIndex != null ? visibilityKm(raw.hourly.visibility[middayIndex]) : null,
      windSpeed: raw.daily.wind_speed_10m_max[i],
    };
  });

  const current: CurrentConditions = {
    weatherCode: raw.current.weather_code,
    temperature: raw.current.temperature_2m,
    feelsLike: raw.current.apparent_temperature,
    windSpeed: raw.current.wind_speed_10m,
    humidity: raw.current.relative_humidity_2m,
    visibility: visibilityKm(raw.current.visibility),
  };

  const dayUnits: MetricUnits = {
    feelsLike: raw.daily_units.apparent_temperature_max,
    windSpeed: raw.daily_units.wind_speed_10m_max,
    humidity: raw.hourly_units.relative_humidity_2m,
    visibility: VISIBILITY_UNIT,
  };

  const currentUnits: MetricUnits = {
    feelsLike: raw.current_units.apparent_temperature,
    windSpeed: raw.current_units.wind_speed_10m,
    humidity: raw.current_units.relative_humidity_2m,
    visibility: VISIBILITY_UNIT,
  };

  return {
    dayUnits,
    currentUnits,
    current,
    dates: raw.daily.time,
    byDate,
  };
};
