import React from 'react';
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Callback from './Callback';
import Landing from './Landing';
import Error from './Error';
import SilentRenew from './SilentRenew';
import withAuth from './WithAuth';

const Routes = ({ history }) => (
    <ConnectedRouter history={history}>
        <Switch>

            {/* Put all non protected routes in this format */}
            <Route exact path="/" component={Home} />
            <Route exact path="/Error" component={Error} />

            {/* Protected Routes */}
            <Route exact path="/Landing" component={withAuth(Landing)} />

            {/* Required for OpenID Connect */}
            <Route exact path="/Callback" component={Callback} />
            <Route exact path="/SilentRenew" component={SilentRenew} />

            {/* Handle non matching routes */}
            <Redirect to="/" />
        </Switch>
    </ConnectedRouter>
);

export default Routes;