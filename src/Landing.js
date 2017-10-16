import React from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as types from './actions/types';
import { getUserManager } from './actions/authActions';
import { httpGetRequest } from './actions/httpActions';
import Navbar from './Navbar';
import './App.css';
import './Landing.css';

class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.onApiClick = this.onApiClick.bind(this);
    }

    onApiClick() {
        console.log("onApiClick handler");
        const accessToken = this.props.auth.user.access_token;
        console.log("Sending accessToken");
        console.log(accessToken);
        this.props.getAllClaims(accessToken);
    }

    renderBody() {
        if (this.props.landingPageData.data) {
            return (
                <div>
                    <h2>Data From The Server</h2>
                    <pre>{JSON.stringify(this.props.landingPageData.data, null, 2)}</pre>
                </div>
            );
        }
        return null;
    }

    renderError() {
        return (
                <div>
                    <h2>An error occurred calling the API</h2>
                    <pre>
                        {JSON.stringify(this.props.landingPageData.error, null, 2)}
                    </pre>
                </div>
            );
    }

    renderUserManagerSettings() {
        const userManagerSettings = this.props.getUserManager().settings;

        const json = {
            authority: userManagerSettings.authority,
            client_id: userManagerSettings.client_id,
            redirect_uri: userManagerSettings.redirect_uri,
            scope: userManagerSettings.scope,
            post_logout_redirect_uri: userManagerSettings.post_logout_redirect_uri
        };

        return (
                <div>
                    <h2>UserManager Settings</h2>
                    <pre>
                        {JSON.stringify(json, null, 2)}
                    </pre>
                </div>
            );
    }

    renderAuthFromRedux() {
        return (
                <div>
                    <h2>Auth (Stored In Redux State)</h2>
                    <pre>
                        {JSON.stringify(this.props.auth, null, 2)}
                    </pre>
                </div>
            );
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <Navbar onLogout={this.props.signOut} isAuthenticated={true} />
                </div>

                <div className="App-content">
                    <div className="row">
                        <div className="col-xs-12">
                            <h3>Route: <code>{this.props.location.pathname}</code></h3>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12">
                            <Tabs defaultActiveKey={1} id="landing-page-tabs">
                                <Tab eventKey={1} title={"Auth (Auth Data Stored In Redux State)"}>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <Button bsStyle="primary" onClick={this.props.getUser}>Show User access_token</Button>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-xs-12">
                                            {this.renderAuthFromRedux()}
                                        </div>
                                    </div>
                                </Tab>

                                <Tab eventKey={2} title={"User Manager Settings"}>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            {this.renderUserManagerSettings()}
                                        </div>
                                    </div>
                                </Tab>


                                <Tab eventKey={3} title={"Call Protected API"}>
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <Button bsStyle="primary" onClick={this.onApiClick}>Call Protected API</Button>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-xs-12">
                                            {this.props.landingPageData.error && this.props.landingPageData.error !== '' ?
                                                this.renderError()
                                                :
                                                this.renderBody()
                                            }
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        landingPageData: state.landingPageData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: () => {
            const userManager = dispatch(getUserManager);
            userManager.getUser().then(user => {
                alert(user.access_token.substring(user.access_token.lastIndexOf(".")));
            });
        },

        getAllClaims : (accessToken) => {
                httpGetRequest('http://localhost:5001/identity', accessToken)
                    .then(response => {
                        dispatch({
                                type: types.GET_ALL_CLAIMS,
                                payload: response.data
                            });
                    }).catch(error => {
                        dispatch({
                                type: types.GET_ALL_CLAIMS_ERROR,
                                payload: error
                            });
                    });
        },

        signOut: () => {
            const userManager = dispatch(getUserManager);
            userManager.signoutRedirect();
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
