import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ForecastArgs, ForecastPlace } from '../../types/forecast';

interface ForecastParamsState {
  args: ForecastArgs | null;
  place: ForecastPlace | null;
  selectedDate?: string;
}

const initialState: ForecastParamsState = { args: null, place: null, selectedDate: undefined };

const slice = createSlice({
  name: 'forecastParams',
  initialState,
  reducers: {
    setForecastArgs(state, action: PayloadAction<ForecastArgs>) {
      const { latitude, longitude,startDate, ...rest } = action.payload;
      state.args = {
        ...rest,
        startDate: startDate,
        latitude: Number(latitude.toFixed(4)),
        longitude: Number(longitude.toFixed(4)),
      };
      state.selectedDate = startDate; 
    },
    setForecastPlace(state, action: PayloadAction<ForecastPlace>) {
      state.place = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    }
    

  },
});

export const { setForecastArgs, setForecastPlace, setSelectedDate } = slice.actions;

export const selectForecastArgs = (state: RootState) => state.forecastParams.args;
export const selectForecastPlace = (state: RootState) => state.forecastParams.place;
export const selectSelectedDate = (state: RootState) => state.forecastParams.selectedDate;

export default slice.reducer;
