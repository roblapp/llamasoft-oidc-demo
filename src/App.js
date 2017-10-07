import React from 'react';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Callback from './Callback';
import SilentRenew from './SilentRenew';
import Landing from './Landing';
import Error from './Error';
import LoginRedirect from './LoginRedirect';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';
import 'animate.css/animate.min.css';
import './App.css';



class App extends React.Component {
    componentWillMount() {
        console.log("Auth componentWillMount");
        this.props.auth.getEventManager().addOnLoginSuccessEventHandler(this.onLoginSuccess);
        this.props.auth.getEventManager().addOnLoginErrorEventHandler(this.onLoginFailure);
        this.props.auth.getEventManager().addOnSilentRenewSuccessEventHandler(this.onSilentRenewSuccess);
        this.props.auth.getEventManager().addOnSilentRenewErrorEventHandler(this.onSilentRenewError);
        this.props.auth.getEventManager().addOnSilentRenewTriggeredEventHandler(this.onSilentRenewTriggered);
    }

    componentWillUnmount() {
        console.log("Auth componentWillUnmount");
        this.props.auth.getEventManager().removeOnLoginSuccessEventHandler(this.onLoginSuccess);
        this.props.auth.getEventManager().removeOnLoginErrorEventHandler(this.onLoginFailure);
        this.props.auth.getEventManager().removeOnSilentRenewSuccessEventHandler(this.onSilentRenewSuccess);
        this.props.auth.getEventManager().removeOnSilentRenewErrorEventHandler(this.onSilentRenewError);
        this.props.auth.getEventManager().removeOnSilentRenewTriggeredEventHandler(this.onSilentRenewTriggered);
    }

    onLoginSuccess = (relativeReturnPath) => {
        console.log("Auth Process Success. Now we need to redirect to path " + relativeReturnPath);
        this.props.history.push(relativeReturnPath);
    }

    onLoginFailure = (error) => {
        console.error("Error!");
        console.error(error);
        this.props.history.push("/Error");
    }

    onSilentRenewSuccess = () => {
        console.log("SilentRenew Success");
    }

    onSilentRenewError = (error) => {
        console.error(error);
        console.error("SilentRenew failed");
    }

    onSilentRenewTriggered = (timeout) => {
        alert(`SilentRenew was triggered. The timeout was ${timeout} milliseconds`);
    }

    render() {
        console.log("App render");
        return (
            <div className="App">
                <div className="App-header">
                    <Navbar auth={this.props.auth} />
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
                                    <Home auth={this.props.auth} {...props} />
                                )}/>
                                <Route exact path="/Error" render={props => (
                                    <Error {...props} />
                                )}/>



                                {/* Required for OpenID Connect */}
                                <Route exact path="/Callback" render={(props) => {
                                    return <Callback auth={this.props.auth} {...props} />;
                                }}/>

                                <Route exact path="/SilentRenew" render={(props) => {
                                    return <SilentRenew auth={this.props.auth} {...props} />;
                                }}/>



                                {/* Put all protected routes in this format */}
                                <Route exact path="/Landing" render={props => (
                                    !this.props.auth.isAuthenticated() ? (
                                    <LoginRedirect auth={this.props.auth} returnUrlPath={location.pathname} {...props} />
                                    ) : (
                                    <Landing auth={this.props.auth} {...props} />
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
    }
}

// export default withRouter(withLLamaAuth(App, () => {}, () => {}, () => {}, () => {}));

//Must add withRouter here so the auth callbacks can access this.props.history
//to complete a redirect from /Callback to the desired landing page. If you
//want to navigate to a URL using window.location then you don't need to wrap
//the component with the withRouter HOC
export default withRouter(App);