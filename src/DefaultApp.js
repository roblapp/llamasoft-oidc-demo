import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Error from './Error';
import './DefaultApp.css';

class DefaultApp extends Component {


  render() {
    console.log("DefaultApp::render()");
    
    return (
        <div className="App">
          <div className="App-header">
              <Navbar userManager={this.props.userManager} isAuthenticated={false} />
          </div>

          <div className="App-content">
            <div className="row">
                <div className="col-xs-12">
                    <Switch>
                        <Route exact path="/" render={props => (
                            <Home {...props} />
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

DefaultApp.propTypes = {
    userManager: PropTypes.object.isRequired
};

export default DefaultApp;
