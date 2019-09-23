import React from 'react';
import { connect } from 'react-redux';

import { WeatherSearch } from '$components/WeatherSearch';
import * as CONTENT_ACTION from '$modules/content/actions';
import {
  IContentRootState,
  IFiveDaysForecast,
  IRequestError,
} from '$modules/content/reducer';
import { IAppState } from '$redux/store';

const styles = require('./styles.module.scss');

interface IStateProps {
  fiveDaysForecast: IFiveDaysForecast,
  lastCity: IContentRootState['lastCity'],
  requestError: IRequestError,
}

const mapStateToProps = ({
  content: {
    fiveDaysForecast,
    lastCity,
    requestError,
  },
}: IAppState): IStateProps => ({
  fiveDaysForecast,
  lastCity,
  requestError,
});

const mapDispatchToProps = {
  getFiveDaysForecast: CONTENT_ACTION.getFiveDaysForecast,
  setLastCity: CONTENT_ACTION.setLastCity,
};

export type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const UnconnectedFiveDayForecast: React.FunctionComponent<IProps> = ({
  fiveDaysForecast,
  lastCity,
  requestError,
  getFiveDaysForecast,
  setLastCity,
}) => (
  <React.Fragment>
    <WeatherSearch
      lastCity={lastCity}
      requestError={requestError}
      getWeather={getFiveDaysForecast}
      setLastCity={setLastCity}
    />
    <div className={styles.weather__view}>
      <h2 className={styles.weather__title}>
          5 deys forecast
      </h2>
      {
          fiveDaysForecast.city && (
            <React.Fragment>
              <div className={styles.weather__card}>
                <p className={styles.weather__city}>
                  {`${fiveDaysForecast.city}, ${fiveDaysForecast.country}`}
                </p>
                {
                  fiveDaysForecast.list.map((currentForecast) => (
                    <div key={`item${currentForecast.date}`}>
                      <p>{currentForecast.dateTxt}</p>
                      <p>{Math.round(currentForecast.temp)}</p>
                      <p>{currentForecast.weather.description}</p>
                      <img
                        src={`http://openweathermap.org/img/wn/${currentForecast.weather.icon}@2x.png`}
                        alt="current weather"
                      />
                    </div>
                  ))
                }
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
