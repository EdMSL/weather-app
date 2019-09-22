import { SagaIterator } from 'redux-saga';
import {
  select, call, put, takeLatest,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import {
  ApiErrorStatusCode,
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
} from '$api/constants';
import { apiGetCurrentWeather, apiGetFiveDaysForecast } from '$api/content';
import { DEFAULT_REQUEST_ERROR } from '$constants/defaultParameters';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { CONTENT_TYPES } from '$modules/content/types';
import {
  generateRequestErrorObject,
  generateCurrentWeatherObject,
  generateFiveDaysForecastObject,
} from '$utils/transformData';
import { IAppState } from '$redux/store';

const getState = (state: IAppState): IAppState => state;

function* getWeatherDataSaga(type: string): SagaIterator {
  const { content: { lastCity } }: IAppState = yield select(getState);

  if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
    return yield call(apiGetCurrentWeather, { city: lastCity });
  }

  return yield call(apiGetFiveDaysForecast, { city: lastCity });
}
// TODO: Try typing weatherData
function* setWeatherSaga(weatherData: AxiosResponse, type: string): SagaIterator {
  const { content: { requestError } }: IAppState = yield select(getState);

  if (!weatherData) return;

  if (weatherData.status < ApiErrorStatusCode.START_ERROR_CODES) {
    if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
      yield put(CONTENT_ACTIONS.setCurrentWeather(generateCurrentWeatherObject(weatherData.data)));
    } else if (type === CONTENT_TYPES.GET_FIVE_DAYS_FORECAST) {
      yield put(CONTENT_ACTIONS.setFiveDaysForecast(generateFiveDaysForecastObject(weatherData.data)));
    } else {
      return;
    }

    if (requestError.status > ApiErrorStatusCode.START_ERROR_CODES) {
      yield put(CONTENT_ACTIONS.setRequestError(DEFAULT_REQUEST_ERROR));
    }
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
  yield takeLatest(CONTENT_TYPES.GET_CURRENT_WEATHER, getCurrentWeatherSaga);
  yield takeLatest(CONTENT_TYPES.GET_FIVE_DAYS_FORECAST, getFiveDaysForecastSaga);
}
