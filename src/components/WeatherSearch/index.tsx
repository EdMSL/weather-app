import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';

import { ApiErrorStatusCode } from '$api/constants';
import { CountryCode } from '$constants/countrysCodes';
import { KeyCode } from '$constants/keyCodes';
import { Button } from '$components/UI/Button';
import * as CONTENT_ACTIONS from '$modules/content/actions';
import { IContentRootState, ICity } from '$modules/content/reducer';
import { Icon } from '$components/UI/Icon';
import { getRandomInt } from '$utils/numbers';
import { generateCountryNameForSprite } from '$utils/transformData';

const styles = require('./styles.module.scss');

interface IProps {
  cities: IContentRootState['cities'],
  isCitiesLoading: IContentRootState['isCitiesLoading'],
  isWeatherLoading: IContentRootState['isWeatherLoading'],
  lastCity: IContentRootState['lastCity'],
  requestError: IContentRootState['requestError'],
  getCities: typeof CONTENT_ACTIONS.getCities,
  getWeather: typeof CONTENT_ACTIONS.getCurrentWeather | typeof CONTENT_ACTIONS.getFiveDaysForecast,
  setCities: typeof CONTENT_ACTIONS.setCities,
}

export const WeatherSearch: React.FunctionComponent<IProps> = ({
  cities,
  isCitiesLoading,
  isWeatherLoading,
  lastCity,
  requestError,
  getCities,
  getWeather,
  setCities,
}) => {
  const searchInput = useRef(null);

  const [isInputError, setIsInputError] = useState<boolean>(false);
  const [isShowCitiesList, setIsShowCitiesList] = useState<boolean>(false);
  const [isInputErrorText, setIsInputErrorText] = useState<string>('');
  const [currentCityName, setCurrentCityName] = useState<string>('');

  const onEscKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === KeyCode.ESC) {
      setIsShowCitiesList(false);
      searchInput.current.blur();
    }
  }, [searchInput]);

  const onWeatherOwerlayClick = useCallback(() => {
    setIsShowCitiesList(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keyup', onEscKeyPress);

    return (): void => {
      window.removeEventListener('keyup', onEscKeyPress);
    };
  });

  const sendWeatherRequest = useCallback((cityData: string | number) => {
    getWeather(cityData);
    setCurrentCityName('');
    setCities([]);
    setIsShowCitiesList(false);
  }, [getWeather, setCities]);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentCityName.trim() && !isInputError && !isWeatherLoading) {
      sendWeatherRequest(currentCityName);
    }
  }, [currentCityName, isInputError, isWeatherLoading, sendWeatherRequest]);

  const onCitiesListItemClick = useCallback((id: number) => {
    sendWeatherRequest(id);
  }, [sendWeatherRequest]);

  const onCityInputFocus = useCallback(() => {
    if (cities.length > 0 && !isShowCitiesList) {
      setIsShowCitiesList(true);
    }
  }, [cities, isShowCitiesList]);

  const onCityInputChange = useCallback((
    { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (value.trim().length > 0 && !isShowCitiesList) {
      setIsShowCitiesList(true);
    }

    if (value.trim().length <= 0) {
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

      if (value.trim()) {
        getCities(value.trim());
      }
    }

    setCurrentCityName(value);
  }, [isInputError, getCities, setCities, isShowCitiesList]);

  return (
    <form
      className={styles.weather__form}
      onSubmit={onFormSubmit}
    >
      {
        cities.length !== 0 && isShowCitiesList && !isInputError && (
          <div
            className={styles.weather__overlay}
            onClick={onWeatherOwerlayClick}
            onKeyDown={onWeatherOwerlayClick}
            role="button"
            tabIndex={0}
          >
            <span className="visually-hidden">overlay</span>
          </div>
        )
      }
      <div className={styles['weather__input-block']}>
        <input
          className={classNames(
            styles.weather__input,
            isInputError && styles['weather__input--error'],
          )}
          type="text"
          value={currentCityName}
          onChange={onCityInputChange}
          onFocus={onCityInputFocus}
          placeholder="City name"
          ref={searchInput}
        />
        {
          cities.length !== 0 && isShowCitiesList && !isInputError && (
            <ul className={classNames(styles['weather__cities-list'])}>
              {
                isCitiesLoading && (
                  <div className={styles['weather__cities-overlay']}>
                    <Icon
                      className={classNames(
                        'rotation-animation',
                        styles['weather__cities-overlay-icon'],
                      )}
                      icon="loader"
                    />
                  </div>
                )
              }
              {
                cities.map((currentCity: ICity) => (
                  <li
                    key={`city-${currentCity.id}_${getRandomInt(10, 50)}`}// eslint-disable-line @typescript-eslint/no-magic-numbers, max-len
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
            if param icon={isWeatherLoading ? ... : ...}.
            No idea how fix it, so i do this by hiding search icon */
        }
        <Button
          className={styles['weather__submit-btn']}
          isSubmit
          isDisabled={isWeatherLoading}
        >
          <Icon
            className={classNames(
              isWeatherLoading && 'hide',
              styles['weather__submit-btn-icon'],
            )}
            icon="search"
          />
          {
            isWeatherLoading && (
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
