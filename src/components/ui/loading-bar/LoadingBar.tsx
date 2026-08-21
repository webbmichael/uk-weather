import styles from './LoadingBar.module.css'

interface LoadingBarProps {
  width?: string
  height?: string
}

export const LoadingBar = ({ width = '100%', height = '12px' }: LoadingBarProps) => (
  <span className={styles.bar} aria-hidden="true" style={{ width, height }} />
)
