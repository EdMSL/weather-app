import React from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import {
  NavLink,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import classNames from 'classnames';

import { history, IAppState } from '$redux/store';
import { PathName } from '$constants/paths';
import { CurrentWeather } from '$components/CurrentWeather';
import { FiveDayForecast } from '$components/FiveDaysForecast';

const styles = require('./styles.module.scss');

interface IStateProps {
  currentWeather: IAppState['content']['currentWeather'],
}

const mapStateToProps = ({
  content: { currentWeather },
}: IAppState): IStateProps => ({
  currentWeather,
});

export type IAppProps = ReturnType<typeof mapStateToProps>;

const UnconnectedApp: React.FunctionComponent<IAppProps> = ({
  currentWeather,
}) => (
  <ConnectedRouter history={history}>
    <main>
      <div className="main-wrapper">
        <h1 className={styles.main__title}>Weather App</h1>
        <section className={styles.router}>
          <NavLink
            exact
            to={PathName.CURRENT_WEATHER}
            className={styles.router__button}
            activeClassName={styles['router__button--active']}
          >
            Current weather
          </NavLink>
          <NavLink
            exact
            to={PathName.FIVE_DAY_FORECAST}
            className={styles.router__button}
            activeClassName={styles['router__button--active']}
          >
            5 day forecast
          </NavLink>
        </section>
        <section className={classNames(styles.weather)}>
          <Switch>
            <Route
              exact
              path={PathName.CURRENT_WEATHER}
              component={CurrentWeather}
            />
            <Route
              path={PathName.FIVE_DAY_FORECAST}
              component={FiveDayForecast}
            />
            <Redirect
              from="/*"
              to={PathName.CURRENT_WEATHER}
            />
          </Switch>
        </section>
      </div>
    </main>
  </ConnectedRouter>
);

export const App = connect(mapStateToProps)(hot(module)(UnconnectedApp));
