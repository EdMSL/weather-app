import { AxiosResponse } from 'axios';

import { CountryCode } from '$constants/countrysCodes';
import { WeatherCode, DAY_NIGHT_CODES } from '$constants/weatherCodes';
import {
  ICurrentWeatherRequestData,
  IFiveDaysForecastRequestData,
  IResponseFiveDaysForecastListItem,
  IResponseGetCitiesListItem,
} from '$api/constants';
import {
  IRequestError,
  ICurrentWeather,
  IFiveDaysForecastListItem,
  IFiveDaysForecast,
  ICity,
} from '$modules/content/reducer';
import { DAYS, MONTHS } from '$constants/date';

export const generateRequestErrorObject = (data: AxiosResponse): IRequestError => ({
  status: data.status,
  statusText: data.statusText,
});

export const generateCityObject = (cityData: IResponseGetCitiesListItem): ICity => ({
  country: cityData.sys.country,
  id: cityData.id,
  name: cityData.name,
});

export const generateCurrentWeatherObject = (
  data: ICurrentWeatherRequestData,
): ICurrentWeather => ({
  city: data.name,
  cityId: data.id,
  clouds: data.clouds.all,
  country: data.sys.country,
  humidity: data.main.humidity,
  pressure: data.main.pressure,
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

export const generateCountryNameForSprite = (countryCode: string): string => {
  if (countryCode && /[A-Z]{2}/.test(countryCode.toUpperCase())) {
    if (CountryCode[countryCode]) {
      const countryNameArr = CountryCode[countryCode].split(' ');

      return countryNameArr.map((currentItem: string) => currentItem.toLowerCase()).join('-');
    }
  }

  return 'unknown';
};

export const isNight = (iconName: string): boolean => iconName[iconName.length - 1] === 'n';

export const generateWeatherIconNameForSprite = (
  weatherData: ICurrentWeather['weather'],
): string => {
  if (WeatherCode[weatherData.id.toString()]) {
    if (DAY_NIGHT_CODES.includes(weatherData.id)) {
      if (isNight(weatherData.icon)) {
        return `weather-${WeatherCode[weatherData.id.toString()]}-night`;
      }

      return `weather-${WeatherCode[weatherData.id.toString()]}-day`;
    }

    return `weather-${WeatherCode[weatherData.id.toString()]}`;
  }

  return 'weather-not-available';
};

export const generateDayMonthStr = (date?: string): string => {
  let newDate: Date;

  if (date) {
    newDate = new Date(date);
    return `${newDate.getDate()} ${MONTHS[newDate.getMonth()]}`;
  }

  newDate = new Date();
  return `${newDate.getDate()} ${MONTHS[newDate.getMonth()]}`;
};

export const generateFullDateStr = (date?: string): string => {
  let newDate: Date;

  if (date) {
    newDate = new Date(date);
    return `${newDate.getMonth() + 1}/${newDate.getDay()}/${newDate.getFullYear()}`;
  }

  newDate = new Date();
  return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
};

export const getDayOfWeek = (date?: string): string => {
  if (date) {
    return DAYS[new Date(date).getDay()];
  }

  return DAYS[new Date().getDay()];
};

export const generateWindSpeedStr = (windSpeed: number): string => `${Math.round(windSpeed)} km/h`;
