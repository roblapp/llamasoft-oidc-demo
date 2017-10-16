import React from 'react';
import { connect } from 'react-redux';
import Navbar from './Navbar';
import { getUserManager } from './actions/authActions';
import './App.css';

class Home extends React.Component {

    render() {
        const userManagerSettings = this.props.getUserManager().settings;

        const json = {
            authority: userManagerSettings.authority,
            client_id: userManagerSettings.client_id,
            redirect_uri: userManagerSettings.redirect_uri,
            scope: userManagerSettings.scope,
            post_logout_redirect_uri: userManagerSettings.post_logout_redirect_uri
        };


        const locationData = {
            hash: window.location.hash,
            host: window.location.host,
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            port: window.location.port,
            protocol: window.location.protocol,
            search: window.location.search
        };

        return (
            <div className="App">
                <div className="App-header">
                    <Navbar onLogin={this.props.signIn} isAuthenticated={false} />
                </div>

                <div className="App-content">
                    <div className="row pad-row">
                        <div className="col-xs-12">
                            <h2>Home Page</h2>
                            <pre>
                                {JSON.stringify(json, null, 2)}
                            </pre>
                            <pre>
                                {JSON.stringify(locationData, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
      getUserManager: () => {
        console.log("getUserManager dispatched in Home component");
        return dispatch(getUserManager);
      },

      signIn: () => {
          console.log("signIn dispatched in Home component");
          const userManager = dispatch(getUserManager);
          userManager.signinRedirect();
      }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
