import { AxiosPromise, AxiosResponse, AxiosError } from 'axios';

import { client } from '$api/config';
import {
  ApiOpenWeatherRequestUrl,
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
  IGetCitiesRequestData,
} from '$api/constants';

interface IGetCities {
  city: string,
}

interface IGetWeather {
  city: string,
}

const getResult = (response: AxiosResponse): AxiosResponse => response;

const onError = ({ response }: AxiosError): AxiosResponse => response;

export const apiGetCities = (
  data: IGetCities,
): AxiosPromise<IGetCitiesRequestData> => (
  client({
    method: 'GET',
    url: `${ApiOpenWeatherRequestUrl.FIND_CITIES}${data.city}`,
  })
    .then(getResult)
    .catch(onError)
);

export const apiGetCurrentWeather = (
  data: IGetWeather,
): AxiosPromise<ICurrentWeatherRequestData> => (
  client({
    method: 'GET',
    url: `${ApiOpenWeatherRequestUrl.GET_CURRENT_WEATHER}${data.city}`,
  })
    .then(getResult)
    .catch(onError)
);

export const apiGetFiveDaysForecast = (
  data: IGetWeather,
): AxiosPromise<IFiveDaysForecastRequestData> => (
  client({
    method: 'GET',
    url: `${ApiOpenWeatherRequestUrl.GET_5_DAYS_FORECAST}${data.city}`,
  })
    .then(getResult)
    .catch(onError)
);
