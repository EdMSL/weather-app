import React from 'react';
import { connect } from 'react-redux';

import { WeatherSearch } from '$components/WeatherSearch';
import { Icon } from '$components/UI/Icon';
import * as CONTENT_ACTION from '$modules/content/actions';
import {
  IContentRootState,
  ICurrentWeather,
  IRequestError,
} from '$modules/content/reducer';
import { IAppState } from '$redux/store';
import { generateCountryNameForSprite, toStringWithFirstUppercaseLetter } from '$utils/strings';

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
}) => (
  <React.Fragment>
    <WeatherSearch
      lastCity={lastCity}
      requestError={requestError}
      getWeather={getCurrentWeather}
      setLastCity={setLastCity}
    />
    <div className={styles.weather__view}>
      <h2 className={styles.weather__title}>
          Current weather
      </h2>
      {
          currentWeather.city && (
            <div className={styles.weather__card}>
              <p className={styles.weather__city}>
                {currentWeather.city}
              </p>
              <Icon
                className={styles.weather__flag}
                icon={`flag-${generateCountryNameForSprite(currentWeather.country)}`}
              />
              <p className={styles.weather__temp}>
                {Math.round(currentWeather.temp)}
                <sup>&#176;</sup>
              </p>
              <div className="levitation-animation">
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather.icon}@2x.png`}
                  alt="current weather"
                  title={currentWeather.weather.description}
                />
              </div>
              <p className={styles.weather__description}>
                {toStringWithFirstUppercaseLetter(currentWeather.weather.description)}
              </p>
            </div>
          )
        }
    </div>
  </React.Fragment>
);

export const CurrentWeather = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedCurrentWeather);
