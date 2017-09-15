import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import DefaultApp from './DefaultApp';
import AuthenticatedApp from './AuthenticatedApp';
import Callback from './Callback';
import SilentRenew from './SilentRenew';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import 'animate.css/animate.min.css';
import './App.css';

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.props.history.listen((location, action) => {
  //     console.log("on route change");
  //     console.log(location);
  //     console.log(action);
  //   });
  // }

  render() {
    console.log("App::render()");
    console.log("Location and OIDC info:");
    console.log(this.props.location);
    console.log(this.props.oidc);

    if (this.props.oidc.isLoadingUser) {
      console.log("user is loading");
      console.log("");
      return (<div>User is Loading</div>);
    }

    if (matchPath(this.props.location.pathname, { path: "/Callback", strict: false, exact: true }) !== null) {
          console.log("/Callback");
          console.log("");
          return (<Callback userManager={this.props.userManager} {...this.props}/>);
    }

    if (matchPath(this.props.location.pathname, { path: "/SilentRenew", strict: false, exact: true }) !== null) {
      console.log("/SilentRenew");
      console.log("");
      return (<SilentRenew {...this.props} />);
    }

    if (this.props.oidc.user && this.props.oidc.user !== null) {
      console.log("detected the user was authenticated. Showing the Authenticated application");
      console.log("");
      return (<AuthenticatedApp userManager={this.props.userManager} />);
    }
    
    console.log("detected the user was NOT authenticated. Showing the Default application");
    console.log("");
    return (<DefaultApp userManager={this.props.userManager} />);
  }
}

App.propTypes = {
    userManager: PropTypes.object.isRequired,
    oidc: PropTypes.object
};


function mapStateToProps(state) {
    return {
        oidc: state.oidc
    };
}

function mapDispatchToProps() {
    return {};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
