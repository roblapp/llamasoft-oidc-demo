import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LLamasoftOidcClient from './auth/LLamasoftOidcClient';
import Navbar from './Navbar';
import Home from './Home';
import Callback from './Callback';
import Landing from './Landing';
import Error from './Error';
import LoginRedirect from './LoginRedirect';
import Logger from './auth/Logger';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import 'animate.css/animate.min.css';
import './App.css';

//App is a container for the entire application
export const App = () => {
    
    console.log("App executing");

    //   this.props.history.listen((location, action) => {
  //     console.log("on route change");
  //     console.log(location);
  //     console.log(action);
  //   });
  // }

    const authority = 'http://localhost:5000'; //'https://demo.identityserver.io';

    //Required
    const authOptions = {
      authority,
      authorizeEndpoint: `${authority}/connect/authorize`,
      endSessionEndpoint: `${authority}/connect/endsession`,

      //Paths MUST begin with leading '/'. They are all relative paths! They cannot be in a different origin.

      redirectPath: '/Callback',                    //OAuth 2.0 client_redirect_uri (must be known to OIDC provider)
      defaultPostAuthorizePath: '/Landing',         //Where the user should end up after the auth process (after the /Callback page)
      defaultPostLogoutRedirectPath: undefined,     //Example: '/LogoutLandingPath'
      silentRenewCallbackPath: '/SilentRenew',      //Must be registered as a client redirect_uri with the OIDC provider

      clientId: 'implicit',                         //The OAuth 2.0 client_id
      responseType: 'id_token token',               //The response type from the OIDC provider
      scopes: 'openid profile email api scgx-identity',           //The requested scopes (as per OIDC spec)
      
      useAutomaticSilentTokenRenew: false,          //For automatic token renewal
      silentRenewIFrameTimeoutSeconds: 10,          //The timeout for the IFrame that silently refreshes tokens
      silentRenewTokenRequestOffsetSeconds: 100,    //Will obtain a new token 100 seconds before the current token expires for a seamless transition
      issuerOverride: undefined                     //Will rarely need this. Override this to a value that will be compared with the iss claim in a JWT
    };

    Logger.level = Logger.DEBUG; //Set logging level to debug

    const authService = new LLamasoftOidcClient(authOptions);

    return (
        <div className="App">
            <div className="App-header">
                <Navbar auth={authService} />
            </div>

            <div className="App-content">
                <div className="row">
                    <div className="col-xs-12">
                        <h3>Route: <code>{location.pathname}</code></h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Switch>

                          {/* Put all non protected routes in this format */}
                            <Route exact path="/" render={props => (
                                <Home auth={authService} {...props} />
                            )}/>
                            <Route exact path="/Error" render={props => (
                                <Error {...props} />
                            )}/>



                            {/* Required for OpenID Connect */}
                            <Route exact path="/Callback" render={(props) => {
                                return <Callback auth={authService} {...props} />;
                            }}/>



                            {/* Put all protected routes in this format */}
                            <Route exact path="/Landing" render={props => (
                                !authService.isAuthenticated() ? (
                                  <LoginRedirect auth={authService} returnUrlPath={location.pathname} {...props} />
                                ) : (
                                  <Landing auth={authService} {...props} />
                                )
                            )}/>
                            


                            {/* Handle non matching routes */}
                            <Route render={props => (
                                <div>
                                <h3>No match for <code>{location.pathname}</code></h3>
                                </div>
                            )} />
                        </Switch>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;