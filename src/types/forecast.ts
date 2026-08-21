export interface ForecastArgs {
  latitude: number;
  longitude: number;
  startDate: string; 
  endDate: string;  
}


export interface WeatherMetrics {
  feelsLike: number | null;
  windSpeed: number | null;
  humidity: number | null;
  visibility: number | null;
}

export interface DayForecast extends WeatherMetrics {
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

export interface CurrentConditions extends WeatherMetrics {
  weatherCode: number;
  temperature: number;
}

export type MetricUnits = Partial<Record<keyof WeatherMetrics, string>>;

export interface Forecast {
  dayUnits: MetricUnits;
  currentUnits: MetricUnits;
  current: CurrentConditions;
  dates: string[];
  byDate: Record<string, DayForecast>;
}

export interface ForecastPlace {
  name: string;
  region: string;
}
