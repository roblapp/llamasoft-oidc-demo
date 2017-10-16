import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { Provider } from 'react-redux';
import store from './store/configureStore';
import Oidc from 'oidc-client';
import Routes from './Routes';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import 'animate.css/animate.min.css';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;

const history = createHistory();

ReactDOM.render(
    <Provider store={store({}, history)}>
        <Routes history={history} />
    </Provider>,
  document.getElementById("root")
);
