import { SagaIterator } from 'redux-saga';
import {
  select,
  call,
  put,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import {
  ApiErrorStatusCode,
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
  IGetCitiesRequestData,
} from '$api/constants';
import {
  apiGetCities,
  apiGetCurrentWeather,
  apiGetFiveDaysForecast,
} from '$api/content';
import { DEFAULT_REQUEST_ERROR, DEFAULT_EMPTY_CITY } from '$constants/defaultParameters';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { CONTENT_TYPES } from '$modules/content/types';
import {
  generateRequestErrorObject,
  generateCurrentWeatherObject,
  generateFiveDaysForecastObject,
  generateCityObject,
  generateLastCityObjectFromCurrentWeatherData,
  generateLastCityObjectFromFiveDaysForecastData,
} from '$utils/transformData';
import { IAppState } from '$redux/store';

const REQUEST_DELAY_TIME = 500;

const getState = (state: IAppState): IAppState => state;

function* getCitiesSaga(
  { payload: cityName }: ReturnType<typeof CONTENT_ACTIONS.getCities>,
): SagaIterator {
  yield delay(REQUEST_DELAY_TIME);

  if (!cityName) return;

  const citiesData: AxiosResponse<IGetCitiesRequestData> = yield call(apiGetCities, { city: cityName });

  if (citiesData.data.list) {
    if (citiesData.data.list.length > 0) {
      const newCities = citiesData.data.list.map(
        (currentCityData) => generateCityObject(currentCityData),
      );

      yield put(CONTENT_ACTIONS.setCities(newCities));
    } else {
      yield put(CONTENT_ACTIONS.setCities([DEFAULT_EMPTY_CITY]));
    }
  } else {
    yield put(CONTENT_ACTIONS.setCities([DEFAULT_EMPTY_CITY]));
  }
}

function* getWeatherDataSaga(type: string, cityName: string | number): SagaIterator {
  yield put(CONTENT_ACTIONS.setIsLoading(true));

  let weatherData: AxiosResponse;
  const { content: { requestError } }: IAppState = yield select(getState);

  if (requestError.status > 0) {
    yield put(CONTENT_ACTIONS.setRequestError(DEFAULT_REQUEST_ERROR));
  }

  if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
    weatherData = yield call(apiGetCurrentWeather, { city: cityName });
  } else {
    weatherData = yield call(apiGetFiveDaysForecast, { city: cityName });
  }

  yield put(CONTENT_ACTIONS.setIsLoading(false));

  return weatherData;
}

function* setWeatherSaga(weatherData: AxiosResponse, type: string): SagaIterator {
  if (!weatherData) return;

  if (weatherData.status < ApiErrorStatusCode.START_ERROR_CODES) {
    if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
      yield put(CONTENT_ACTIONS.setCurrentWeather(generateCurrentWeatherObject(weatherData.data)));
      yield put(CONTENT_ACTIONS.setLastCity(
        generateLastCityObjectFromCurrentWeatherData(weatherData.data as ICurrentWeatherRequestData),
      ));
    } else if (type === CONTENT_TYPES.GET_FIVE_DAYS_FORECAST) {
      yield put(CONTENT_ACTIONS.setFiveDaysForecast(generateFiveDaysForecastObject(weatherData.data)));
      yield put(CONTENT_ACTIONS.setLastCity(
        generateLastCityObjectFromFiveDaysForecastData(weatherData.data as IFiveDaysForecastRequestData),
      ));
    }
    yield put(CONTENT_ACTIONS.setCities([]));
  } else {
    yield put(CONTENT_ACTIONS.setRequestError(generateRequestErrorObject(weatherData)));
  }
}

function* getCurrentWeatherSaga(
  { type, payload: cityName }: ReturnType<typeof CONTENT_ACTIONS.getCurrentWeather>,
): SagaIterator {
  const weatherData: AxiosResponse<ICurrentWeatherRequestData> = yield call(getWeatherDataSaga, type, cityName);

  yield call(setWeatherSaga, weatherData, type);
}

function* getFiveDaysForecastSaga(
  { type, payload: cityName }: ReturnType<typeof CONTENT_ACTIONS.getFiveDaysForecast>,
): SagaIterator {
  const weatherData: AxiosResponse<IFiveDaysForecastRequestData> = yield call(getWeatherDataSaga, type, cityName);

  yield call(setWeatherSaga, weatherData, type);
}

export default function* contentSaga(): SagaIterator {
  yield takeLatest(CONTENT_TYPES.GET_CITIES, getCitiesSaga);
  yield takeLatest(CONTENT_TYPES.GET_CURRENT_WEATHER, getCurrentWeatherSaga);
  yield takeLatest(CONTENT_TYPES.GET_FIVE_DAYS_FORECAST, getFiveDaysForecastSaga);
}
