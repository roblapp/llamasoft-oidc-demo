import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import Logger from './auth/Logger';
import AuthManager from './auth/AuthManager';
// import Logger from 'oidc-client';
// import { UserManager } from 'oidc-client';
import App from './App';
import './index.css';


const oidcProviderDomain = 'http://localhost:5000'; //'https://demo.identityserver.io';
const currentDomain = window.location.origin;

//Required
const authOptions = {
    oidcProviderDomain,                                                //The OIDC provider base domain
    redirectUri: `${currentDomain}/Callback`,                           //OAuth 2.0 client_redirect_uri (must be known to OIDC provider)
    clientId: 'implicit',                                               //The OAuth 2.0 client_id
    responseType: 'id_token token',                                     //The response type from the OIDC provider
    scopes: 'openid profile email api scgx-identity',                   //The requested scopes (as per OIDC spec)
    jwtClockSkewSeconds: 5*60,
};

Logger.level = Logger.DEBUG; //Set logging level to debug (must be specified first)
let authManager = new AuthManager(authOptions);
                     
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App auth={authManager} />
        </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);
