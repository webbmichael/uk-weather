import { useAppDispatch } from "../../app/hooks"
import { useForecast } from "../../features/forecast/useForecast"
import { setSelectedDate } from "../../features/forecast/forecastSlice"
import { dayLabel } from "../../features/forecast/format"
import { DayButton } from "../ui/day-button/DayButton"
import styles from './DayForecast.module.css'

export const DayForecast = () => {
  const dispatch = useAppDispatch()
  const { data, isLoading, selectedDate } = useForecast()

  if (!data) {
    if (!isLoading) return null
    return (
      <section className={styles.panel}>
        <ul className={styles.days}>
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>
              <DayButton isLoading />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className={styles.panel}>
      <ul className={styles.days}>
        {data.dates.map((date) => (
          <li key={date}>
            <DayButton
              label={dayLabel(date)}
              code={data.byDate[date].weatherCode}
              high={data.byDate[date].tempMax}
              low={data.byDate[date].tempMin}
              selected={date === selectedDate}
              onSelect={() => dispatch(setSelectedDate(date))}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
