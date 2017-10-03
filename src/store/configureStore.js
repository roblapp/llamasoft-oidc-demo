import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
// import createOidcMiddleware from 'redux-oidc';
// import userManager from '../config/UserManager';

console.log("Creating Store");

// const oidcMiddleware = createOidcMiddleware(userManager);

// const customMiddleware = store => next => action => {
//   console.log("Custom MiddleWare Logging");
//   console.log(action);
//   next(action);
// }

function configureStoreProd(initialState) {
  console.log("Configuring Production Store");
  const middlewares = [
    // Add other middleware on this line...
    // customMiddleware,

    // oidcMiddleware,

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  const store = createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));

  return store;
}

function configureStoreDev(initialState) {
  console.log("Configuring Dev Store");

  const middlewares = [
    // Add other middleware on this line...
    // customMiddleware,
    
    // oidcMiddleware,

    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    reduxImmutableStateInvariant(),

    // thunk middleware can also accept an extra argument to be passed to each thunk action
    // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    thunk,
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;

const store = configureStore();

export { store };