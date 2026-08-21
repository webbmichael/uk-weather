import { useAppSelector } from '../../app/hooks'
import { dayLabel } from '../../features/forecast/format'
import { selectForecastPlace } from '../../features/forecast/forecastSlice'
import { useForecast } from '../../features/forecast/useForecast'
import type { WeatherMetrics } from '../../types/forecast'
import { MetricCard } from '../ui/metric-card/MetricCard'
import { Notice } from '../ui/notice/Notice'
import { WeatherHero } from '../ui/weather-hero/WeatherHero'
import styles from './CurrentWeather.module.css'

const weatherMetrics: { label: string; key: keyof WeatherMetrics }[] = [
  { label: 'FEELS LIKE', key: 'feelsLike' },
  { label: 'WIND', key: 'windSpeed' },
  { label: 'HUMIDITY', key: 'humidity' },
  { label: 'VISIBILITY', key: 'visibility' },
]

export const CurrentWeather = () => {
  const forecastPlace = useAppSelector(selectForecastPlace)
  const {
    isLoading,
    error,
    selectedDate,
    selectedDay,
    isToday,
    metrics,
    metricUnits,
  } = useForecast()

  if (error) {
    return (
      <section className={styles.notice}>
        <Notice title="Something went wrong" isAlert>
          We couldn’t load the forecast. Check your connection and try again.
        </Notice>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className={styles.panel}>
        <WeatherHero isLoading />
        <div className={styles.metrics}>
          {weatherMetrics.map(({ key }) => (
            <MetricCard key={key} isLoading />
          ))}
        </div>
      </section>
    )
  }

  const temperature = isToday
    ? metrics && 'temperature' in metrics
      ? metrics.temperature
      : undefined
    : selectedDay
      ? (selectedDay.tempMax + selectedDay.tempMin) / 2
      : undefined

  return (
    <section className={styles.panel}>
      <WeatherHero
        stamp={isToday ? 'NOW' : selectedDate && dayLabel(selectedDate)}
        name={forecastPlace?.name || 'Location'}
        region={forecastPlace?.region}
        temperature={temperature}
        conditions={
          selectedDay && {
            code: metrics?.weatherCode ?? selectedDay.weatherCode,
            high: selectedDay.tempMax,
            low: selectedDay.tempMin,
          }
        }
      />

      <div className={styles.metrics}>
        {metrics &&
          weatherMetrics.map(({ label, key }) => (
            <MetricCard
              key={key}
              label={label}
              value={metrics[key]}
              unit={metricUnits[key]}
            />
          ))}
      </div>
    </section>
  )
}