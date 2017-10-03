/*import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Landing from './Landing';
import Error from './Error';
import './AuthenticatedApp.css';

class AuthenticatedApp extends Component {

  render() {
    console.log("AuthenticatedApp::render()");
    return (
        <div className="App">
            <div className="App-header">
                <Navbar userManager={this.props.userManager} isAuthenticated={true} />
            </div>

            <div className="App-content">
                <div className="row pad-row">
                    <h3>Route: <code>{location.pathname}</code></h3>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <Switch>
                            <Route path="/Landing" render={props => (
                                <Landing {...props} />
                            )}/>
                            <Route exact path="/" render={props => (
                                <Error {...props} />
                            )}/>
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
  }
}

AuthenticatedApp.propTypes = {
    userManager: PropTypes.object.isRequired
};

export default AuthenticatedApp;*/
