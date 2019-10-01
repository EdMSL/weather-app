import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

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
import {
  generateDayMonthStr,
  generateCountryNameForSprite,
  generateFiveDaysForecastInterval,
  generateWeatherIconNameForSprite,
  getDayOfWeek,
} from '$utils/transformData';

const styles = require('./styles.module.scss');

interface IStateProps {
  cities: IContentRootState['cities'],
  fiveDaysForecast: IFiveDaysForecast,
  isCitiesLoading: IContentRootState['isCitiesLoading'],
  isWeatherLoading: IContentRootState['isWeatherLoading'],
  requestError: IRequestError,
}

const mapStateToProps = ({
  content: {
    cities,
    fiveDaysForecast,
    isCitiesLoading,
    isWeatherLoading,
    requestError,
  },
}: IAppState): IStateProps => ({
  cities,
  fiveDaysForecast,
  isCitiesLoading,
  isWeatherLoading,
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
  isCitiesLoading,
  isWeatherLoading,
  requestError,
  getCities,
  getFiveDaysForecast,
  setCities,
}) => (
  <React.Fragment>
    <WeatherSearch
      cities={cities}
      isCitiesLoading={isCitiesLoading}
      isWeatherLoading={isWeatherLoading}
      requestError={requestError}
      getCities={getCities}
      getWeather={getFiveDaysForecast}
      setCities={setCities}
    />
    <div className={styles.weather__view}>
      {
        !fiveDaysForecast.city && (
          <h2 className={styles['weather__main-title']}>
            5 deys forecast
          </h2>
        )
      }
      {
        fiveDaysForecast.city && (
          <div className={styles.weather__container}>
            <div className={styles.weather__header}>
              <div className={styles.weather__info}>
                <p className={styles.weather__city}>
                  {fiveDaysForecast.city}
                </p>
                <Icon
                  className={styles.weather__flag}
                  icon={`flag-${generateCountryNameForSprite(fiveDaysForecast.country)}`}
                />
              </div>
              <p className={classNames(styles.weather__info, styles.weather__title)}>
                5 deys forecast
              </p>
              <div className={styles.weather__info}>
                <p className={styles['weather__forecast-info']}>
                  {generateFiveDaysForecastInterval(fiveDaysForecast.list)}
                </p>
              </div>
            </div>
            <div className={styles.weather__cards}>
              {
                fiveDaysForecast.list.map((currentForecast: IFiveDaysForecastListItem) => (
                  <div
                    key={`item${currentForecast.date}`}
                    className={styles.weather__card}
                  >
                    <div className={styles['weather__card-header']}>
                      <p className={styles.weather__date}>
                        {generateDayMonthStr(currentForecast.dateTxt)}
                      </p>
                      <p className={styles.weather__day}>
                        {getDayOfWeek(currentForecast.dateTxt)}
                      </p>
                    </div>
                    <div className={styles['weather__card-body']}>
                      <p className={styles.weather__time}>
                        {`${new Date(currentForecast.dateTxt).getHours()}:00`}
                      </p>
                      <p className={styles.weather__temp}>
                        {Math.round(currentForecast.temp)}
                        <sup>&#176;</sup>
                      </p>
                      <p className={styles.weather__description}>
                        {toStringWithFirstUppercaseLetter(currentForecast.weather.description)}
                      </p>
                      <Icon
                        className={styles.weather__icon}
                        icon={generateWeatherIconNameForSprite(currentForecast.weather)}
                        size={50}
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  </React.Fragment>
);

export const FiveDayForecast = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedFiveDayForecast);
