import { AxiosResponse } from 'axios';

import { ICurrentWeatherRequestData } from '$api/constants';
import { IRequestError, ICurrentWeather } from '$modules/content/reducer';

export const generateRequestErrorObject = (data: AxiosResponse): IRequestError => ({
  status: data.status,
  statusText: data.statusText,
});

export const generateCurrentWeatherObject = (
  data: ICurrentWeatherRequestData,
): ICurrentWeather => ({
  city: data.name,
  cityId: data.id,
  clouds: data.clouds.all,
  temp: data.main.temp,
  wind: data.wind,
  weather: data.weather[0],
});
