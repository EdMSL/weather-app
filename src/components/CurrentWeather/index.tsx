import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { IAppState } from '$redux/store';
import * as CONTENT_ACTION from '$modules/content/actions';
import { Button } from '$components/UI/Button';

const styles = require('./styles.module.scss');

interface IStateProps {
  currentWeather: IAppState['content']['currentWeather'],
  lastCity: IAppState['content']['lastCity'],
}

const mapStateToProps = ({
  content: {
    currentWeather,
    lastCity,
  },
}: IAppState): IStateProps => ({
  currentWeather,
  lastCity,
});

const mapDispatchToProps = {
  getCurrentWeather: CONTENT_ACTION.getCurrentWeather,
  setLastCity: CONTENT_ACTION.setLastCity,
};

export type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const UnconnectedCurrentWeather: React.FunctionComponent<IProps> = ({
  lastCity,
  currentWeather,
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
        <Button isSubmit>
          Get weather
        </Button>
      </form>
      <div className={styles.weather__view}>
        <h2>Current weather</h2>

      </div>
    </React.Fragment>
  );
};

export const CurrentWeather = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedCurrentWeather);
