import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { IAppState } from '$redux/store';
import * as CONTENT_ACTION from '$modules/content/actions';
import { Button } from '$components/UI/Button';

const styles = require('./styles.module.scss');

interface IStateProps {
  fiveDaysForecast: IAppState['content']['fiveDaysForecast'],
  lastCity: IAppState['content']['lastCity'],
}

const mapStateToProps = ({
  content: {
    fiveDaysForecast,
    lastCity,
  },
}: IAppState): IStateProps => ({
  fiveDaysForecast,
  lastCity,
});

const mapDispatchToProps = {
  getFiveDaysForecast: CONTENT_ACTION.getFiveDaysForecast,
  setLastCity: CONTENT_ACTION.setLastCity,
};

export type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const UnconnectedFiveDayForecast: React.FunctionComponent<IProps> = ({
  fiveDaysForecast,
  lastCity,
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
        <Button isSubmit>
          Get weather
        </Button>
      </form>
      <p>5 days forecast</p>
    </React.Fragment>
  );
};

export const FiveDayForecast = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedFiveDayForecast);
