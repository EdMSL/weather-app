import { AxiosResponse } from 'axios';

import {
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
  IResponseFiveDaysForecastListItem,
} from '$api/constants';
import {
  IRequestError,
  ICurrentWeather,
  IFiveDaysForecastListItem,
  IFiveDaysForecast,
} from '$modules/content/reducer';
import { MONTHS } from '$constants/date';

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
  country: data.sys.country,
  temp: data.main.temp,
  wind: data.wind,
  weather: data.weather[0],
});

const generateFiveDaysForecastListItemObject = (
  item: IResponseFiveDaysForecastListItem,
): IFiveDaysForecastListItem => ({
  clouds: item.clouds.all,
  date: item.dt,
  dateTxt: item.dt_txt,
  temp: item.main.temp,
  wind: item.wind,
  weather: item.weather[0],
});

export const generateFiveDaysForecastObject = (
  data: IFiveDaysForecastRequestData,
): IFiveDaysForecast => ({
  city: data.city.name,
  cityId: data.city.id,
  country: data.city.country,
  list: data.list.map(generateFiveDaysForecastListItemObject),
});

export const generateDateTxt = (date: string): string => {
  const newDate = new Date(date);

  return `${newDate.getDate()} ${MONTHS[newDate.getMonth()]}`;
};
