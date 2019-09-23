import React, { useCallback } from 'react';

import { Button } from '$components/UI/Button';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { IContentRootState } from '$modules/content/reducer';

const styles = require('./styles.module.scss');

interface IProps {
  lastCity: IContentRootState['lastCity'],
  requestError: IContentRootState['requestError'],
  getWeather: typeof CONTENT_ACTIONS.getCurrentWeather | typeof CONTENT_ACTIONS.getFiveDaysForecast,
  setLastCity: typeof CONTENT_ACTIONS.setLastCity,
}

export const WeatherSearch: React.FunctionComponent<IProps> = ({
  lastCity,
  requestError,
  getWeather,
  setLastCity,
}) => {
  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    getWeather();
  }, [getWeather]);

  const onCityInputChange = useCallback(({ target: { value } }) => {
    setLastCity(value);
  }, [setLastCity]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      <input
        className={styles.weather__input}
        type="text"
        value={lastCity}
        onChange={onCityInputChange}
      />
      {
        requestError.status > 0 && (
          <span>{`City ${requestError.statusText}`}</span>
        )
      }
      <Button isSubmit>
        Get weather
      </Button>
    </form>
  );
};
