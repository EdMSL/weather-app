import { createReducer } from 'reduxsauce';

import {
  DEFAULT_REQUEST_ERROR,
  DEFAULT_CURRENT_WEATHER, DEFAULT_FIVE_DAYS_FORECAST,
} from '$constants/defaultParameters';
import { CONTENT_TYPES } from '$modules/content/types';
import * as CONTENT_ACTIONS from '$modules/content/actions';

interface IWeather {
  description: string,
  icon: string,
  id: number,
  main: string,
}

interface IWind {
  deg: number,
  speed: number,
}

export interface ICity {
  id: number,
  country: string,
  name: string,
}

export interface ICurrentWeather {
  city: string,
  cityId: number,
  clouds: number,
  country: string,
  humidity: number,
  pressure: number,
  temp: number,
  weather: IWeather,
  wind: IWind,
}

export interface IFiveDaysForecastListItem {
  clouds: number,
  date: number,
  dateTxt: string,
  temp: number,
  weather: IWeather,
  wind: IWind,
}

export interface IFiveDaysForecast {
  city: string,
  cityId: number,
  country: string,
  list: IFiveDaysForecastListItem[],
}

export interface IRequestError {
  status: number,
  statusText: string,
}

export type IContentRootState = Readonly<{
  cities: ICity[],
  currentWeather: ICurrentWeather,
  fiveDaysForecast: IFiveDaysForecast,
  lastCity: string,
  requestError: IRequestError,
}>;

/* eslint-disable @typescript-eslint/no-explicit-any */
type UnsafeReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
/* eslint-enable @typescript-eslint/no-explicit-any */

interface IActionHandler<T> {
  (state: IContentRootState, payload: UnsafeReturnType<T>): IContentRootState,
}

const setCities: IActionHandler<typeof CONTENT_ACTIONS.setCities> = (
  state,
  { payload: cities },
) => ({
  ...state,
  cities,
});

const setCurrentWeather: IActionHandler<typeof CONTENT_ACTIONS.setCurrentWeather> = (
  state,
  { payload: currentWeather },
) => ({
  ...state,
  currentWeather,
});

const setFiveDaysForecast: IActionHandler<typeof CONTENT_ACTIONS.setFiveDaysForecast> = (
  state,
  { payload: fiveDaysForecast },
) => ({
  ...state,
  fiveDaysForecast,
});

const setLastCity: IActionHandler<typeof CONTENT_ACTIONS.setLastCity> = (
  state,
  { payload: lastCity },
) => ({
  ...state,
  lastCity,
});

const setRequestError: IActionHandler<typeof CONTENT_ACTIONS.setRequestError> = (
  state,
  { payload: requestError },
) => ({
  ...state,
  requestError,
});

const HANDLERS = {
  [CONTENT_TYPES.SET_CITIES]: setCities,
  [CONTENT_TYPES.SET_CURRENT_WEATHER]: setCurrentWeather,
  [CONTENT_TYPES.SET_FIVE_DAYS_FORECAST]: setFiveDaysForecast,
  [CONTENT_TYPES.SET_LAST_CITY]: setLastCity,
  [CONTENT_TYPES.SET_REQUEST_ERROR]: setRequestError,
};

const INITIAL_STATE: IContentRootState = {
  cities: [],
  currentWeather: DEFAULT_CURRENT_WEATHER,
  fiveDaysForecast: DEFAULT_FIVE_DAYS_FORECAST,
  lastCity: '',
  requestError: DEFAULT_REQUEST_ERROR,
};

export const contentReducer = createReducer<IContentRootState>(INITIAL_STATE, HANDLERS);
