import type { ReactNode } from 'react'
import styles from './Notice.module.css'

interface NoticeProps {
  title: string
  children: ReactNode
  isAlert?: boolean
}

export const Notice = ({ title, children, isAlert = false }: NoticeProps) => (
  <section className={styles.notice} role={isAlert ? 'alert' : undefined}>
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.body}>{children}</p>
  </section>
)
