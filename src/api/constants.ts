interface IResponseClouds {
  all: number,
}

interface IResponseCoord {
  lat: number,
  lon: number,
}

interface IResponseMain {
  humidity: number,
  pressure: number,
  temp: number,
  temp_min: number,
  temp_max: number,
}

export interface IResponseGetCitiesListItem {
    id: number,
    name: string,
    coord: IResponseCoord,
    main: IResponseMain,
    dt: number,
    sys: {
      country: string,
    },
    rain?: {
      '1h': number,
    },
    snow?: {
      '1h': number,
    },
    clouds: IResponseClouds,
    weather: IResponseWeather[],
    wind: IResponseWind,
}

interface IResponseMainFiveDaysForecast extends IResponseMain {
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

export interface IGetCitiesRequestData {
  cod: string,
  count: number,
  list: IResponseGetCitiesListItem[],
  message: number,
}

export interface ICurrentWeatherRequestData {
  base: string,
  clouds: IResponseClouds,
  cod: number,
  coord: IResponseCoord,
  dt: number,
  id: number,
  main: IResponseMain,
  name: string,
  sys: {
    type: number,
    id: number,
    message: number,
    country: string,
    sunrise: number,
    sunset: number,
  },
  timezone: number,
  visibility: number,
  weather: IResponseWeather[],
  wind: IResponseWind,
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
  cnt: number,
  cod: string,
  list: IResponseFiveDaysForecastListItem[],
  message: number,
}

const API_KEY = '09864f104fd238ceb72091abd292903c';
const REQUEST_PARAMETERS = `appid=${API_KEY}`;

export const ApiErrorStatusCode = {
  START_ERROR_CODES: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZEDS: 401,
  NOT_FOUND: 404,
  INTERNAL_STATUS_ERROR: 500,
};

export const ApiOpenWeatherRequestUrl = {
  BASE: 'https://api.openweathermap.org/data/2.5/',
  FIND_CITIES: `find?${REQUEST_PARAMETERS}`,
  GET_CURRENT_WEATHER: `weather?${REQUEST_PARAMETERS}`,
  GET_5_DAYS_FORECAST: `forecast?${REQUEST_PARAMETERS}`,
};
