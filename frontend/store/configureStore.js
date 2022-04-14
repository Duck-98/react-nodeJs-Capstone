import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";

import reducer from "../reducers";
import rootSaga from "../sagas";

const loggerMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log(action);
    return next(action);
  };

const configureStore = () => {
  const sagaMiddlewares = createSagaMiddleware();
  const middlewares = [sagaMiddlewares, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares)) // 배포용
      : composeWithDevTools(applyMiddleware(...middlewares)); // 개발용
  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddlewares.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
