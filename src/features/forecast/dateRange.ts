import type { ForecastArgs } from '../../types/forecast';

const FORECAST_DAYS = 5;

export const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;

export const forecastRange = (
  from = new Date(),
): Pick<ForecastArgs, 'startDate' | 'endDate'> => {
  const end = new Date(from);
  end.setDate(end.getDate() + FORECAST_DAYS - 1);
  return { startDate: isoDate(from), endDate: isoDate(end) };
};
