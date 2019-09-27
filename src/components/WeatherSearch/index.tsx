import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import { ApiErrorStatusCode } from '$api/constants';
import { Button } from '$components/UI/Button';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { IContentRootState, ICity } from '$modules/content/reducer';
import { Icon } from '$components/UI/Icon';
import { generateCountryNameForSprite } from '$utils/transformData';
import { CountryCode } from '$constants/countrysCodes';

const styles = require('./styles.module.scss');

interface IProps {
  cities: IContentRootState['cities'],
  lastCity: IContentRootState['lastCity'],
  requestError: IContentRootState['requestError'],
  getCities: typeof CONTENT_ACTIONS.getCities,
  getWeather: typeof CONTENT_ACTIONS.getCurrentWeather | typeof CONTENT_ACTIONS.getFiveDaysForecast,
  setLastCity: typeof CONTENT_ACTIONS.setLastCity,
  setCities: typeof CONTENT_ACTIONS.setCities,
}

export const WeatherSearch: React.FunctionComponent<IProps> = ({
  cities,
  lastCity,
  requestError,
  getCities,
  getWeather,
  setLastCity,
  setCities,
}) => {
  const [inputError, setInputError] = useState<boolean>(false);

  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    if (lastCity.trim() && !inputError) {
      getWeather();
    }
  }, [getWeather, inputError, lastCity]);

  const onCityInputChange = useCallback(({ target: { value } }) => {
    if (/[^a-z-\s]/i.test(value)) {
      setInputError(true);
    } else if (inputError) {
      setInputError(false);
    }

    setLastCity(value);
    getCities();
  }, [setLastCity, inputError, getCities]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      <div className={styles['weather__input-block']}>
        <input
          className={classNames(styles.weather__input, inputError && styles['weather__input--error'])}
          type="text"
          value={lastCity}
          onChange={onCityInputChange}
          placeholder="City name"
        />
        {
          cities.length !== 0 && (
            <ul className={styles['weather__cities-list']}>
              {
                cities.map((currentCity: ICity) => (currentCity.id
                  ? (
                    <li
                      key={`city-${currentCity.id}`}
                      className={styles['weather__cities-item']}
                    >
                      <p className={styles['weather__cities-name']}>
                        {`${currentCity.name}, ${CountryCode[currentCity.country]}`}
                      </p>
                      <Icon
                        icon={`flag-${generateCountryNameForSprite(currentCity.country)}`}
                        size={16}
                      />
                    </li>
                  )
                  : (
                    <p key={currentCity.name}>No matches</p>
                  )))
              }
            </ul>
          )
        }
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
      </div>
      <Button isSubmit>
        Get weather
      </Button>
    </form>
  );
};
