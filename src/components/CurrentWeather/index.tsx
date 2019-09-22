import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Button } from '$components/UI/Button';
import * as CONTENT_ACTION from '$modules/content/actions';
import {
  IContentRootState,
  ICurrentWeather,
  IRequestError,
} from '$modules/content/reducer';
import { IAppState } from '$redux/store';

const styles = require('./styles.module.scss');

interface IStateProps {
  currentWeather: ICurrentWeather,
  lastCity: IContentRootState['lastCity'],
  requestError: IRequestError,
}

const mapStateToProps = ({
  content: {
    currentWeather,
    lastCity,
    requestError,
  },
}: IAppState): IStateProps => ({
  currentWeather,
  lastCity,
  requestError,
});

const mapDispatchToProps = {
  getCurrentWeather: CONTENT_ACTION.getCurrentWeather,
  setLastCity: CONTENT_ACTION.setLastCity,
};

export type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const UnconnectedCurrentWeather: React.FunctionComponent<IProps> = ({
  currentWeather,
  lastCity,
  requestError,
  getCurrentWeather,
  setLastCity,
}) => {
  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    getCurrentWeather();
  }, [getCurrentWeather]);

  const onCityInputChange = useCallback(({ target: { value } }) => {
    setLastCity(value);
  }, [setLastCity]);

  return (
    <React.Fragment>
      <form
        className={styles.weather__form}
        onSubmit={onFormSubmit}
      >
        <input
          type="text"
          name="currentWeather"
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
      <div className={styles.weather__view}>
        <h2 className={styles.weather__title}>
          Current weather
        </h2>
        {
          currentWeather.city && (
            <React.Fragment>
              <div className={styles.weather__card}>
                <p className={styles.weather__city}>
                  {`${currentWeather.city}, ${currentWeather.country}`}
                </p>
                <p className={styles.weather__temp}>
                  {Math.round(currentWeather.temp)}
                </p>
                <div>
                  <img
                    src={`http://openweathermap.org/img/wn/${currentWeather.weather.icon}@2x.png`}
                    alt="current weather"
                  />
                </div>
                <p className={styles.weather__temp}>
                  {currentWeather.weather.description}
                </p>
              </div>
            </React.Fragment>
          )
        }
      </div>
    </React.Fragment>
  );
};

export const CurrentWeather = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedCurrentWeather);
