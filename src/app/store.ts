import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { locationsApi } from '../features/locations/locationsApi'
import { forecastApi } from '../features/forecast/forecastApi'
import forecastParamsReducer from '../features/forecast/forecastSlice'

/** Builds a store. A factory rather than a bare singleton so each test gets its
 *  own RTK Query cache from the same configuration the app runs. */
export const createStore = () => {
  const store = configureStore({
    reducer: {
      [locationsApi.reducerPath]: locationsApi.reducer,
      [forecastApi.reducerPath]: forecastApi.reducer,
      forecastParams: forecastParamsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(locationsApi.middleware, forecastApi.middleware),
  })

  setupListeners(store.dispatch)

  return store
}

export const store = createStore()

export type AppStore = ReturnType<typeof createStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
