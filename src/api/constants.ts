interface IResponseClouds {
  all: number,
}

interface IResponseCoord {
  lat: number,
  lon: number,
}

interface IResponseMainCurrentWeather {
  humidity: number,
  pressure: number,
  temp: number,
  temp_min: number,
  temp_max: number,
}

interface IResponseMainFiveDaysForecast extends IResponseMainCurrentWeather {
  grnd_level: number,
  sea_level: number,
  temp_kf: number,
}

export interface IResponseFiveDaysForecastListItem {
  clouds: IResponseClouds,
  dt: number,
  dt_txt: string,
  main: IResponseMainFiveDaysForecast,
  rain?: {
    '3h': number,
  },
  snow?: {
    '3h': number,
  },
  sys: {
    pod: string,
  },
  weather: IResponseWeather[],
  wind: IResponseWind,
}

interface IResponseWeather {
  description: string,
  id: number,
  icon: string,
  main: string,
}

interface IResponseWind {
  deg: number,
  speed: number,
}

export interface ICurrentWeatherRequestData {
  coord: IResponseCoord,
  weather: IResponseWeather[],
  base: string,
  main: IResponseMainCurrentWeather,
  visibility: number,
  wind: IResponseWind,
  clouds: IResponseClouds,
  dt: number,
  sys: {
    type: number,
    id: number,
    message: number,
    country: string,
    sunrise: number,
    sunset: number,
  },
  timezone: number,
  id: number,
  name: string,
  cod: number,
}

export interface IFiveDaysForecastRequestData {
  city: {
    id: number,
    name: string,
    coord: IResponseCoord,
    country: string,
    timezone: number,
    population?: number,
    sunrise?: number,
    sunset?: number,
  },
  cod: string,
  message: number,
  cnt: number,
  list: IResponseFiveDaysForecastListItem[],
}

const API_KEY = '09864f104fd238ceb72091abd292903c';
const REQUEST_PARAMETERS = `APPID=${API_KEY}&units=metric&lang=en`;

export const ApiErrorStatusCode = {
  START_ERROR_CODES: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZEDS: 401,
  NOT_FOUND: 404,
  INTERNAL_STATUS_ERROR: 500,
};

export const ApiOpenWeatherRequestUrl = {
  BASE: 'http://api.openweathermap.org/data/2.5/',
  GET_CURRENT_WEATHER: `weather?${REQUEST_PARAMETERS}&q=`,
  GET_5_DAYS_FORECAST: `forecast?${REQUEST_PARAMETERS}&q=`,
};
