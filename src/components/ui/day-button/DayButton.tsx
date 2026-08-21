import { LoadingBar } from '../loading-bar/LoadingBar'
import { WeatherIcon } from '../weather-icon/WeatherIcon'
import { weatherLabel } from '../../../features/forecast/format'
import styles from './DayButton.module.css'

interface LoadingProps {
  isLoading: true
  label?: never
  code?: never
  high?: never
  low?: never
  selected?: never
  onSelect?: never
}

interface LoadedProps {
  isLoading?: boolean;
  label: string
  code: number
  high: number
  low: number
  selected?: boolean
  onSelect: () => void
}

type DayButtonProps = LoadingProps | LoadedProps

export const DayButton = ({ isLoading, label, code, high, low, selected = false, onSelect }: DayButtonProps) => {
  if (isLoading) {
    return (
      <div className={styles.day}>
        <span className={styles.name}><LoadingBar height="13px" /></span>
        <span className={styles.icon}><LoadingBar width="100%" height="100%" /></span>
        <span className={styles.condition}><LoadingBar height="20px" /></span>
        <span className={styles.temps}><LoadingBar width="62px" height="29px" /></span>
      </div>
    )
  }

  return (
    <button type="button" className={styles.day} aria-pressed={selected} onClick={onSelect}>
      <span className={styles.name}>{label}</span>
      <WeatherIcon code={code} className={styles.icon} />
      <span className={styles.condition}>{weatherLabel(code)}</span>
      <span className={styles.temps}>
        <span>{Math.round(high)}°</span>
        <span className={styles.low}>{Math.round(low)}°</span>
      </span>
    </button>
  )
}
