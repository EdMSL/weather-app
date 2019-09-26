import { ICurrentWeather, IRequestError, IFiveDaysForecast } from '$modules/content/reducer';

export const DEFAULT_CURRENT_WEATHER: ICurrentWeather = {
  city: '',
  cityId: 0,
  clouds: 0,
  country: '',
  humidity: 0,
  pressure: 0,
  temp: 0,
  weather: {
    id: 0,
    main: '',
    description: '',
    icon: '',
  },
  wind: {
    deg: 0,
    speed: 0,
  },
};

export const DEFAULT_FIVE_DAYS_FORECAST: IFiveDaysForecast = {
  city: '',
  cityId: 0,
  country: '',
  list: [],
};

export const DEFAULT_REQUEST_ERROR: IRequestError = {
  status: 0,
  statusText: '',
};
