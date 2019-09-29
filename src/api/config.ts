import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { ApiOpenWeatherRequestUrl } from './constants';

export const client = (props: AxiosRequestConfig): AxiosPromise => axios({
  method: props.method,
  baseURL: `${ApiOpenWeatherRequestUrl.BASE}/`,
  url: props.url,
  headers: {
    'Content-Type': 'text/plain',
  },
  params: {
    ...props.params,
    units: 'metric',
    lang: 'en',
  },
  data: props.data,
});
