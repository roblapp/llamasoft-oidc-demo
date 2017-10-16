import {createStore, compose, applyMiddleware} from 'redux';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { routerMiddleware } from 'react-router-redux';
import { UserManager } from 'oidc-client';
import config from '../config';

console.log("Creating Store");

// const customMiddleware = store => next => action => {
//   console.log("Custom MiddleWare Logging");
//   console.log(action);
//   next(action);
// }

let userManager = new UserManager(config.oidc);
// userManager.events.addUserLoaded((user) => {
//     alert("User Loaded");
//     console.dir(user);
// });

const services = {
  UserManager: userManager
};

export default (initialState, history) => {
    let middlewares;
    let store;

    if (process.env.NODE_ENV === 'production') {
        console.log("Production Store configuration");

        middlewares = [
          // Add other middleware on this line...
          // customMiddleware,
          routerMiddleware(history),
          // oidcMiddleware,

          // thunk middleware can also accept an extra argument to be passed to each thunk action
          // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
          thunk.withExtraArgument(services)
      ];

      store = createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));

    } else {
        console.log("Development Store configuration");
        middlewares = [
          // Add other middleware on this line...
          // customMiddleware,
          
          // oidcMiddleware,
          routerMiddleware(history),

          // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
          reduxImmutableStateInvariant(),

          // thunk middleware can also accept an extra argument to be passed to each thunk action
          // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
          thunk.withExtraArgument(services)
        ];

        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

        store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

        if (module.hot) {
          // Enable Webpack hot module replacement for reducers
          module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default; // eslint-disable-line global-require
            store.replaceReducer(nextReducer);
          });
        }
    }

    return store;
}
