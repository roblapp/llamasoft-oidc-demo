// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import userManager from './config/UserManager';
import { Provider } from 'react-redux';
import { OidcProvider, loadUser } from 'redux-oidc';
import { store } from './store/configureStore';
import App from './App';
import './index.css';

// console.log("About to dispatch INIT_APP store");
// store.dispatch({type: 'INIT_APP'});
// console.log(store);
loadUser(store, userManager);

ReactDOM.render(
    <Provider store={store}>
      <OidcProvider store={store} userManager={userManager} >
        <BrowserRouter>
            <App userManager={userManager} />
        </BrowserRouter>
      </OidcProvider>
    </Provider>,
  document.getElementById('root')
);
