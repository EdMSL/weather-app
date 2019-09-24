import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import { ApiErrorStatusCode } from '$api/constants';
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
  const [inputError, setInputError] = useState<boolean>(false);

  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    if (!inputError) {
      getWeather();
    }
  }, [getWeather, inputError]);

  const onCityInputChange = useCallback(({ target: { value } }) => {
    if (/[^a-z-\s]/i.test(value)) {
      setInputError(true);
    } else if (inputError) {
      setInputError(false);
    }

    setLastCity(value);
  }, [setLastCity, inputError]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      <input
        className={classNames(styles.weather__input, inputError && styles['weather__input--error'])}
        type="text"
        value={lastCity}
        onChange={onCityInputChange}
      />
      {
        inputError && (
          <p className={styles.weather__error}>
            Only latin letters, - and space simbols!
          </p>
        )
      }
      {
        requestError.status === ApiErrorStatusCode.NOT_FOUND && (
          <p className={styles.weather__error}>
            {`City ${requestError.statusText.toLowerCase()}`}
          </p>
        )
      }
      {
        requestError.status > 0 && requestError.status !== ApiErrorStatusCode.NOT_FOUND && (
          <p className={styles.weather__error}>
            Something wrong. Please, try again.
          </p>
        )
      }
      <Button isSubmit>
        Get weather
      </Button>
    </form>
  );
};
