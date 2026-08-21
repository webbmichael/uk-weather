import { LoadingBar } from '../loading-bar/LoadingBar'
import { WeatherIcon } from '../weather-icon/WeatherIcon'
import { weatherLabel } from '../../../features/forecast/format'
import styles from './WeatherHero.module.css'

interface WeatherHeroProps {
  isLoading?: boolean
  stamp?: string
  name: string
  region?: string
  temperature?: number
  conditions?: { code: number; high: number; low: number }
}

interface WeatherHeroSkeletonProps {
  isLoading: true
  stamp?: never
  name?: never
  region?: never
  temperature?: never
  conditions?: never
}

export const WeatherHero = ({ isLoading, stamp, name, region, temperature, conditions }: WeatherHeroProps | WeatherHeroSkeletonProps) => {
  if (isLoading) {
    return (
      <div className={styles.hero}>
        <LoadingBar width="38%" height="13px" />
        <header>
          <LoadingBar width="56%" height="28px" />
          <LoadingBar width="44%" height="20px" />
        </header>
        <div className={styles.reading}>
          <LoadingBar width="40%" height="64px" />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.hero}>
      {stamp && <span className={styles.stamp}>{stamp}</span>}
      <header>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.region}>{region}</p>
      </header>
      <div className={styles.reading}>
        {temperature !== undefined && <p className={styles.temp}>{Math.round(temperature)}°</p>}
        {conditions && (
          <div className={styles.conditions}>
            <WeatherIcon code={conditions.code} className={styles.icon} />
            <p className={styles.condition}>{weatherLabel(conditions.code)}</p>
            <p className={styles.range}>
              High {Math.round(conditions.high)}°  Low {Math.round(conditions.low)}°
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
