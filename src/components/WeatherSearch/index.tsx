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
  setCities: typeof CONTENT_ACTIONS.setCities,
}

export const WeatherSearch: React.FunctionComponent<IProps> = ({
  cities,
  lastCity,
  requestError,
  getCities,
  getWeather,
  setCities,
}) => {
  const [inputError, setInputError] = useState<boolean>(false);
  const [currentCityName, setCurrentCityName] = useState<string>('');

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentCityName.trim() && !inputError) {
      getWeather(currentCityName);
    }
  }, [currentCityName, getWeather, inputError]);

  const onCityInputChange = useCallback((
    { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (cities.length > 0) {
      setCities([]);
    }

    if (/[^a-z-\s]/i.test(value)) {
      setInputError(true);
    } else if (inputError) {
      setInputError(false);
    }

    setCurrentCityName(value);

    if (value) {
      getCities(value);
    }
  }, [cities, inputError, getCities, setCities]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      <div className={styles['weather__input-block']}>
        <input
          className={classNames(styles.weather__input, inputError && styles['weather__input--error'])}
          type="text"
          value={currentCityName}
          onChange={onCityInputChange}
          placeholder="City name"
        />
        {
          cities.length !== 0 && (
            <ul className={styles['weather__cities-list']}>
              {
                cities.map((currentCity: ICity) => (
                  <li
                    key={`city-${currentCity.id}`}
                    className={styles['weather__cities-item']}
                  >
                    {
                      currentCity.id
                        ? (
                          <React.Fragment>
                            <p className={styles['weather__cities-name']}>
                              {`${currentCity.name}, ${CountryCode[currentCity.country]}`}
                            </p>
                            <Icon
                              icon={`flag-${generateCountryNameForSprite(currentCity.country)}`}
                              size={16}
                            />
                          </React.Fragment>
                        )
                        : (
                          <p className={styles['weather__cities-name']}>
                            No matches
                          </p>
                        )
                    }
                  </li>
                ))
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
