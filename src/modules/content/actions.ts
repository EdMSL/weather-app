import { CONTENT_TYPES } from '$modules/content/types';
import {
  IContentRootState,
  IFiveDaysForecast,
  IRequestError,
  ICurrentWeather,
} from '$modules/content/reducer';

interface IActionReturnType<T> {
  type: string,
  payload?: T,
}

export const getCities = (cityName: string): IActionReturnType<string> => ({
  type: CONTENT_TYPES.GET_CITIES,
  payload: cityName,
});

export const getCurrentWeather = (
  cityName: string | number,
): IActionReturnType<string | number> => ({
  type: CONTENT_TYPES.GET_CURRENT_WEATHER,
  payload: cityName,
});

export const getFiveDaysForecast = (
  cityName: string | number,
): IActionReturnType<string | number> => ({
  type: CONTENT_TYPES.GET_FIVE_DAYS_FORECAST,
  payload: cityName,
});

export const setCities = (
  cities: IContentRootState['cities'],
): IActionReturnType<typeof cities> => ({
  type: CONTENT_TYPES.SET_CITIES,
  payload: cities,
});

export const setCurrentWeather = (
  currentWeather: ICurrentWeather,
): IActionReturnType<typeof currentWeather> => ({
  type: CONTENT_TYPES.SET_CURRENT_WEATHER,
  payload: currentWeather,
});

export const setFiveDaysForecast = (
  fiveDaysForecast: IFiveDaysForecast,
): IActionReturnType<typeof fiveDaysForecast> => ({
  type: CONTENT_TYPES.SET_FIVE_DAYS_FORECAST,
  payload: fiveDaysForecast,
});

export const setIsCitiesLoading = (
  isCitiesLoading: IContentRootState['isCitiesLoading'],
): IActionReturnType<typeof isCitiesLoading> => ({
  type: CONTENT_TYPES.SET_IS_CITIES_LOADING,
  payload: isCitiesLoading,
});

export const setIsWeatherLoading = (
  isWeatherLoading: IContentRootState['isWeatherLoading'],
): IActionReturnType<typeof isWeatherLoading> => ({
  type: CONTENT_TYPES.SET_IS_WEATHER_LOADING,
  payload: isWeatherLoading,
});

export const setLastCity = (
  lastCity: IContentRootState['lastCity'],
): IActionReturnType<typeof lastCity> => ({
  type: CONTENT_TYPES.SET_LAST_CITY,
  payload: lastCity,
});

export const setRequestError = (
  requestError: IRequestError,
): IActionReturnType<typeof requestError> => ({
  type: CONTENT_TYPES.SET_REQUEST_ERROR,
  payload: requestError,
});
