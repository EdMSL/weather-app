import React from 'react';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';
import {
  NavLink,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import classNames from 'classnames';

import { history } from '$redux/store';
import { PathName } from '$constants/paths';
import { CurrentWeather } from '$components/CurrentWeather';
import { FiveDayForecast } from '$components/FiveDaysForecast';
import { Icon } from '$components/UI/Icon';

const styles = require('./styles.module.scss');

const UnconnectedApp: React.FunctionComponent<{}> = () => (
  <ConnectedRouter history={history}>
    <main className={styles.main}>
      <a
        className={styles['main__github-link']}
        href="https://github.com/EdMSL/weather-app"
        target="_blanc"
      >
        <Icon
          className={styles['main__github-icon']}
          icon="github"
        />
      </a>
      <div className={styles.main__wrapper}>
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
            5 days forecast
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
              from="*"
              to={PathName.CURRENT_WEATHER}
            />
          </Switch>
        </section>
      </div>
    </main>
  </ConnectedRouter>
);

export const App = hot(module)(UnconnectedApp);
