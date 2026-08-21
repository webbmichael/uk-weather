import { skipToken } from '@reduxjs/toolkit/query/react'
import { useAppSelector } from '../../app/hooks'
import { useGetForecastQuery } from './forecastApi'
import { selectForecastArgs, selectSelectedDate } from './forecastSlice'

export const useForecast = () => {
  const forecastArgs = useAppSelector(selectForecastArgs)
  const selectedDate = useAppSelector(selectSelectedDate)

  const { data, isFetching, error, refetch } = useGetForecastQuery(
    forecastArgs ?? skipToken,
  )

  const isToday = data ? selectedDate === data.dates[0] : false
  const selectedDay = selectedDate ? data?.byDate[selectedDate] : undefined

  return {
    data,
    isLoading: isFetching && !data,
    error,
    refetch,
    selectedDate,
    selectedDay,
    isToday,
    metrics: isToday ? data?.current : selectedDay,
    metricUnits: (isToday ? data?.currentUnits : data?.dayUnits) ?? {},
  }
}
