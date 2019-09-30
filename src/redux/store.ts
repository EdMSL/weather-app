import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Store,
} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { PersistConfig, Persistor } from 'redux-persist/es/types';

import { contentReducer, IContentRootState } from '$modules/content/reducer';
import contentSaga from '$modules/content/sagas';

const contentPersistConfig: PersistConfig<IContentRootState> = {
  key: 'content',
  whitelist: [],
  storage,
};

export const sagaMiddleware = createSagaMiddleware();
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  content: persistReducer(contentPersistConfig, contentReducer),
  router: connectRouter(history),
});

export type IAppState = ReturnType<typeof rootReducer>

const composeEnhancers = typeof window === 'object'
/* eslint-disable @typescript-eslint/no-explicit-any */
  && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
  : compose;
/* eslint-enable @typescript-eslint/no-explicit-any */

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleware,
    ),
  ),
);

export function configureStore(): { store: Store<IAppState>, persistor: Persistor, } {
  sagaMiddleware.run(contentSaga);

  const persistor = persistStore(store);

  return { store, persistor };
}
