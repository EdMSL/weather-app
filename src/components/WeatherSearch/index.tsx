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
  const [inputErrorText, setInputErrorText] = useState<string>('');
  const [currentCityName, setCurrentCityName] = useState<string>('');

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentCityName.trim() && !inputError) {
      getWeather(currentCityName);
    }
  }, [currentCityName, getWeather, inputError]);

  const onCitiesListItemClick = useCallback((id: number) => {
    getWeather(id);
  }, [getWeather]);

  const onCityInputChange = useCallback((
    { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (cities.length > 0) {
      setCities([]);
    }

    if (/[^a-z-\s]/i.test(value)) {
      setInputError(true);
      setInputErrorText('Only latin letters, - and space simbols!');
      // FIXME RegExp below is not working
    } else if (value.match(/[^a-z\s]{1}[^a-z-\s]+/i)) {
      setInputError(true);
      setInputErrorText('First simbol mast be a letter!');
    } else {
      if (inputError) {
        setInputError(false);
      }

      getCities(value);
    }

    setCurrentCityName(value);
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
                          <Button
                            className={styles['weather__cities-item-btn']}
                            onClick={() => onCitiesListItemClick(currentCity.id)}
                          >
                            <p className={styles['weather__cities-name']}>
                              {`${currentCity.name}, ${CountryCode[currentCity.country]}`}
                            </p>
                            <Icon
                              icon={`flag-${generateCountryNameForSprite(currentCity.country)}`}
                              size={16}
                            />
                          </Button>
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
        <Button
          className={styles['weather__submit-btn']}
          isSubmit
        >
          <Icon
            className={styles['weather__search-icon']}
            icon="search"
          />
        </Button>
      </div>
      {
        inputError && (
          <p className={styles.weather__error}>
            {inputErrorText}
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
    </form>
  );
};
