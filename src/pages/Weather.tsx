import { useAppSelector } from '../app/hooks'
import { selectForecastArgs } from '../features/forecast/forecastSlice'
import { CurrentWeather } from '../components/CurrentWeather/CurrentWeather'
import { DayForecast } from '../components/DayForecast/DayForecast'
import { SearchToBegin } from '../components/SearchToBegin/SearchToBegin'
import { WeatherSearch } from '../components/WeatherSearch'

export const WeatherPage = () => {
  const forecastArgs = useAppSelector(selectForecastArgs)

  return (
    <>
      <WeatherSearch />
      {forecastArgs ? (
        <>
          <CurrentWeather />
          <DayForecast />
        </>
      ) : (
        <SearchToBegin />
      )}
    </>
  )
}
