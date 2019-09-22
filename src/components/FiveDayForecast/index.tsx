import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { Button } from '$components/UI/Button';
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
}) => {
  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    getFiveDaysForecast();
  }, [getFiveDaysForecast]);

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
          name="fiveDaysForecast"
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
};

export const FiveDayForecast = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedFiveDayForecast);
