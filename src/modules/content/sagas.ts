import { SagaIterator } from 'redux-saga';
import {
  select, call, put, takeLatest,
} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import { ApiErrorStatusCode, ICurrentWeatherRequestData } from '$api/constants';
import { apiGetCurrentWeather, apiGetFiveDaysForecast } from '$api/content';
import { DEFAULT_REQUEST_ERROR } from '$constants/defaultParameters';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { CONTENT_TYPES } from '$modules/content/types';
import { generateRequestErrorObject, generateCurrentWeatherObject } from '$utils/transformData';
import { IAppState } from '$redux/store';

const getState = (state: IAppState): IAppState => state;

function* getWeatherSaga(type: string): SagaIterator {
  const { content: { lastCity } } = yield select((state) => state);

  if (type === CONTENT_TYPES.GET_CURRENT_WEATHER) {
    return yield call(apiGetCurrentWeather, { city: lastCity });
  }

  return yield call(apiGetFiveDaysForecast, { city: lastCity });
}

function* getCurrentWeatherSaga(
  { type }: ReturnType<typeof CONTENT_ACTIONS.getCurrentWeather>,
): SagaIterator {
  const { content: { requestError } }: IAppState = yield select(getState);
  const weatherData: AxiosResponse<ICurrentWeatherRequestData> = yield call(getWeatherSaga, type);

  if (!weatherData) return;

  if (weatherData.status < ApiErrorStatusCode.START_ERROR_CODES) {
    yield put(CONTENT_ACTIONS.setCurrentWeather(generateCurrentWeatherObject(weatherData.data)));

    if (requestError.status > ApiErrorStatusCode.START_ERROR_CODES) {
      yield put(CONTENT_ACTIONS.setRequestError(DEFAULT_REQUEST_ERROR));
    }
  } else {
    yield put(CONTENT_ACTIONS.setRequestError(generateRequestErrorObject(weatherData)));
  }
}

function* getFiveDaysForecastSaga(
  { type }: ReturnType<typeof CONTENT_ACTIONS.getFiveDaysForecast>,
): SagaIterator {
  const { content: { requestError } }: IAppState = yield select(getState);
  const weatherData: AxiosResponse = yield call(getWeatherSaga, type);

  if (!weatherData) return;
  console.log(weatherData);
  if (weatherData.status < ApiErrorStatusCode.START_ERROR_CODES) {
    yield put(CONTENT_ACTIONS.setFiveDaysForecast(weatherData.data));

    if (requestError.status > ApiErrorStatusCode.START_ERROR_CODES) {
      yield put(CONTENT_ACTIONS.setRequestError(DEFAULT_REQUEST_ERROR));
    }
  } else {
    yield put(CONTENT_ACTIONS.setRequestError(generateRequestErrorObject(weatherData)));
  }
}

export default function* contentSaga(): SagaIterator {
  yield takeLatest(CONTENT_TYPES.GET_CURRENT_WEATHER, getCurrentWeatherSaga);
  yield takeLatest(CONTENT_TYPES.GET_FIVE_DAYS_FORECAST, getFiveDaysForecastSaga);
}
