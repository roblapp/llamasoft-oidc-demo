import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import authOptions from './auth/SampleAuthOptions';
import LLamasoftOidcClient from './auth/LLamasoftOidcClient';
import Logger from './auth/Logger';
import App from './App';
import './index.css';

Logger.level = Logger.DEBUG; //Set logging level to debug (must be specified first)
let authService = new LLamasoftOidcClient(authOptions); //This will fail if you make it a const and try and add events. Just use ES6 let
                         
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App auth={authService} />
        </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);
