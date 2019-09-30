import React from 'react';
import { connect } from 'react-redux';

import { Icon } from '$components/UI/Icon';
import { WeatherSearch } from '$components/WeatherSearch';
import * as CONTENT_ACTION from '$modules/content/actions';
import {
  IContentRootState,
  IFiveDaysForecast,
  IFiveDaysForecastListItem,
  IRequestError,
} from '$modules/content/reducer';
import { IAppState } from '$redux/store';
import { toStringWithFirstUppercaseLetter } from '$utils/strings';
import { generateDayMonthStr, generateCountryNameForSprite } from '$utils/transformData';

const styles = require('./styles.module.scss');

interface IStateProps {
  cities: IContentRootState['cities'],
  fiveDaysForecast: IFiveDaysForecast,
  isLoading: IContentRootState['isLoading'],
  lastCity: IContentRootState['lastCity'],
  requestError: IRequestError,
}

const mapStateToProps = ({
  content: {
    cities,
    fiveDaysForecast,
    isLoading,
    lastCity,
    requestError,
  },
}: IAppState): IStateProps => ({
  cities,
  fiveDaysForecast,
  isLoading,
  lastCity,
  requestError,
});

const mapDispatchToProps = {
  getCities: CONTENT_ACTION.getCities,
  getFiveDaysForecast: CONTENT_ACTION.getFiveDaysForecast,
  setCities: CONTENT_ACTION.setCities,
};

export type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const UnconnectedFiveDayForecast: React.FunctionComponent<IProps> = ({
  cities,
  fiveDaysForecast,
  isLoading,
  lastCity,
  requestError,
  getCities,
  getFiveDaysForecast,
  setCities,
}) => (
  <React.Fragment>
    <WeatherSearch
      cities={cities}
      lastCity={lastCity}
      isLoading={isLoading}
      requestError={requestError}
      getCities={getCities}
      getWeather={getFiveDaysForecast}
      setCities={setCities}
    />
    <div className={styles.weather__view}>
      <h2 className={styles.weather__title}>
          5 deys forecast
      </h2>
      {
          fiveDaysForecast.city && (
            <React.Fragment>
              <div className={styles.weather__container}>
                <p className={styles.weather__city}>
                  {fiveDaysForecast.city}
                </p>
                <Icon
                  className={styles.weather__flag}
                  icon={generateCountryNameForSprite(fiveDaysForecast.country)}
                />
                <div className={styles.weather__cards}>
                  {
                    fiveDaysForecast.list.map((currentForecast: IFiveDaysForecastListItem) => (
                      <div
                        key={`item${currentForecast.date}`}
                        className={styles.weather__card}
                      >
                        <p className={styles.weather__date}>
                          {generateDayMonthStr(currentForecast.dateTxt)}
                        </p>
                        <p className={styles.weather__time}>
                          {`${new Date(currentForecast.dateTxt).getHours()}:00`}
                        </p>
                        <p className={styles.weather__temp}>
                          {Math.round(currentForecast.temp)}
                          <sup>&#176;</sup>
                        </p>
                        <p>
                          {toStringWithFirstUppercaseLetter(currentForecast.weather.description)}
                        </p>
                        <img
                          src={`https://openweathermap.org/img/wn/${currentForecast.weather.icon}@2x.png`} // eslint-disable-line max-len
                          alt="current weather"
                          title={currentForecast.weather.description}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </React.Fragment>
          )
        }
    </div>
  </React.Fragment>
);

export const FiveDayForecast = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedFiveDayForecast);
