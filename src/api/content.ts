import { AxiosPromise, AxiosResponse, AxiosError } from 'axios';

import { client } from '$api/config';
import {
  ApiOpenWeatherRequestUrl,
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
} from '$api/constants';

interface IGetWeather {
  city: string,
}

const getResult = (response: AxiosResponse): AxiosResponse => response;

const onError = ({ response }: AxiosError): AxiosResponse => response;

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
