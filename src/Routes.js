/*import React from 'react';
import { Redirect, Route, BrowserRouter, Switch } from 'react-router-dom';
import LLamasoftAuthentication from './auth/LLamasoftAuthentication';
import history from './history';
import Navbar from './Navbar';
import Home from './Home';
import Callback from './Callback';
import Landing from './Landing';
import Error from './Error';


const authService = new LLamasoftAuthentication();


const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    authService.handleAuthentication();
  }
};

export const makeMainRoutes = () => {

    return (
        <BrowserRouter>
            <App auth={} {...props} />
        </BrowserRouter>
    );
};*/