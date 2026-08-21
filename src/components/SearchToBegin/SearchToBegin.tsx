import { Notice } from '../ui/notice/Notice'
import styles from './SearchToBegin.module.css'
export const SearchToBegin = () => {
  return (
    <section className={styles.panel}>
      <Notice title="Search to begin">
        Search for a UK city or postcode.
      </Notice>
    </section>
  )
}
