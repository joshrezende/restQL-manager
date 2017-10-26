import { createStore } from 'redux';
import rootReducer from '../reducers/rootReducer';

export const store = configureStore({});

export function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

