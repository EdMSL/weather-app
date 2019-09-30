import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { LoaderOptionsPlugin } from 'webpack';

import { ApiErrorStatusCode } from '$api/constants';
import { KeyCode } from '$constants/keyCodes';
import { Button } from '$components/UI/Button';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { IContentRootState, ICity } from '$modules/content/reducer';
import { Icon } from '$components/UI/Icon';
import { generateCountryNameForSprite } from '$utils/transformData';
import { CountryCode } from '$constants/countrysCodes';

const styles = require('./styles.module.scss');

interface IProps {
  cities: IContentRootState['cities'],
  isLoading: IContentRootState['isLoading'],
  lastCity: IContentRootState['lastCity'],
  requestError: IContentRootState['requestError'],
  getCities: typeof CONTENT_ACTIONS.getCities,
  getWeather: typeof CONTENT_ACTIONS.getCurrentWeather | typeof CONTENT_ACTIONS.getFiveDaysForecast,
  setCities: typeof CONTENT_ACTIONS.setCities,
}

export const WeatherSearch: React.FunctionComponent<IProps> = ({
  cities,
  isLoading,
  lastCity,
  requestError,
  getCities,
  getWeather,
  setCities,
}) => {
  const [isInputError, setIsInputError] = useState<boolean>(false);
  const [isShowCitiesList, setIsShowCitiesList] = useState<boolean>(true);
  const [isInputErrorText, setIsInputErrorText] = useState<string>('');
  const [currentCityName, setCurrentCityName] = useState<string>('');

  const onEscKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === KeyCode.ESC) {
      console.log('press esc');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', onEscKeyPress);

    return (): void => {
      window.removeEventListener('keyup', onEscKeyPress);
    };
  });

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentCityName.trim() && !isInputError) {
      getWeather(currentCityName);
      setCurrentCityName('');
    }
  }, [currentCityName, getWeather, isInputError]);

  const onCitiesListItemClick = useCallback((id: number) => {
    getWeather(id);
    setCurrentCityName('');
  }, [getWeather]);

  const onCityInputChange = useCallback((
    { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (cities.length > 0) {
      setCities([]);
    }

    if (/[^a-z-\s]/i.test(value)) {
      setIsInputError(true);
      setIsInputErrorText('Only latin letters, - and space simbols!');
    } else if (value.trim().match(/^[^a-z\s]/i)) {
      setIsInputError(true);
      setIsInputErrorText('First simbol mast be a letter!');
    } else {
      if (isInputError) {
        setIsInputError(false);
      }

      getCities(value);
    }

    setCurrentCityName(value);
  }, [cities, isInputError, getCities, setCities]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      <div className={styles['weather__input-block']}>
        <input
          className={classNames(styles.weather__input, isInputError && styles['weather__input--error'])}
          type="text"
          value={currentCityName}
          onChange={onCityInputChange}
          placeholder="City name"
        />
        {
          cities.length !== 0 && (
            <ul className={classNames(styles['weather__cities-list'], !isShowCitiesList && 'hide')}>
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
                            onClick={(): void => onCitiesListItemClick(currentCity.id)}
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
                          <p className={styles['weather__no-cities-item']}>
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
          /* FIXME: Search icon does not go back after first request,
            if param icon={isLoading ? ... : ...}.
            No idea how fix it, so i do this by hiding search icon */
        }
        <Button
          className={styles['weather__submit-btn']}
          isSubmit
        >
          <Icon
            className={classNames(
              isLoading && 'hide',
              styles['weather__submit-btn-icon'],
            )}
            icon="search"
          />
          {
            isLoading && (
              <Icon
                className={classNames(
                  'rotation-animation',
                  styles['weather__submit-btn-icon'],
                )}
                icon="loader"
              />
            )
          }
        </Button>
      </div>
      {
        isInputError && (
          <p className={styles.weather__error}>
            {isInputErrorText}
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
