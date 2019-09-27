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
  IFiendCitiesRequestData,
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
} from '$utils/transformData';
import { IAppState } from '$redux/store';

const REQUEST_DELAY_TIME = 500;

const getState = (state: IAppState): IAppState => state;

function* getCitiesSaga(): SagaIterator {
  yield delay(REQUEST_DELAY_TIME);

  const { content: { lastCity } }: IAppState = yield select(getState);

  if (!lastCity) return;

  const citiesData: AxiosResponse<IFiendCitiesRequestData> = yield call(apiGetCities, { city: lastCity });

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

function* getWeatherDataSaga(type: string): SagaIterator {
  const { content: { lastCity, requestError } }: IAppState = yield select(getState);

  if (requestError.status > 0) {
    yield put(CONTENT_ACTIONS.setRequestError(DEFAULT_REQUEST_ERROR));
  }

  if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
    return yield call(apiGetCurrentWeather, { city: lastCity });
  }

  return yield call(apiGetFiveDaysForecast, { city: lastCity });
}
// TODO: Try typing weatherData
function* setWeatherSaga(weatherData: AxiosResponse, type: string): SagaIterator {
  if (!weatherData) return;

  if (weatherData.status < ApiErrorStatusCode.START_ERROR_CODES) {
    if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
      yield put(CONTENT_ACTIONS.setCurrentWeather(generateCurrentWeatherObject(weatherData.data)));
    } else if (type === CONTENT_TYPES.GET_FIVE_DAYS_FORECAST) {
      yield put(CONTENT_ACTIONS.setFiveDaysForecast(generateFiveDaysForecastObject(weatherData.data)));
    }
    yield put(CONTENT_ACTIONS.setCities([]));
  } else {
    yield put(CONTENT_ACTIONS.setRequestError(generateRequestErrorObject(weatherData)));
  }
}

function* getCurrentWeatherSaga(
  { type }: ReturnType<typeof CONTENT_ACTIONS.getCurrentWeather>,
): SagaIterator {
  const weatherData: AxiosResponse<ICurrentWeatherRequestData> = yield call(getWeatherDataSaga, type);

  yield call(setWeatherSaga, weatherData, type);
}

function* getFiveDaysForecastSaga(
  { type }: ReturnType<typeof CONTENT_ACTIONS.getFiveDaysForecast>,
): SagaIterator {
  const weatherData: AxiosResponse<IFiveDaysForecastRequestData> = yield call(getWeatherDataSaga, type);

  yield call(setWeatherSaga, weatherData, type);
}

export default function* contentSaga(): SagaIterator {
  yield takeLatest(CONTENT_TYPES.GET_CITIES, getCitiesSaga);
  yield takeLatest(CONTENT_TYPES.GET_CURRENT_WEATHER, getCurrentWeatherSaga);
  yield takeLatest(CONTENT_TYPES.GET_FIVE_DAYS_FORECAST, getFiveDaysForecastSaga);
}
