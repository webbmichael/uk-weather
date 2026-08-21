import { LoadingBar } from '../loading-bar/LoadingBar'
import styles from './MetricCard.module.css'



interface MetricCardProps {
  isLoading?: never;
  label: string
  value: string | number | null
  unit?: string
}

interface MetricCardSkeletonProps {
  isLoading: true
  label?: never
  value?: never
  unit?: never
}

export const MetricCard = ({ isLoading, label, value, unit = '' }: MetricCardProps | MetricCardSkeletonProps) => {
  if (isLoading) {
    return (
      <div className={styles.card}>
        <LoadingBar width="52%" height="13px" />
        <LoadingBar width="40%" height="29px" />
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value === null ? '–' : `${value}${unit}`}</span>
    </div>
  )
}
