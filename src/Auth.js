// import React from 'react';
// import PropTypes from 'prop-types';

// class Auth extends React.Component {
//     constructor(props) {
//         super(props);

//         this.auth = props.auth;
//     }

//     componentWillMount() {
//         console.log("Auth componentWillMount");
//         this.auth.eventManager.addOnLoginSuccessEventHandler(this.onLoginSuccess);
//         this.auth.eventManager.addOnLoginErrorEventHandler(this.onLoginFailure);
//         this.auth.eventManager.addOnSilentRenewSuccessEventHandler(this.onSilentRenewSuccess);
//         this.auth.eventManager.addOnSilentRenewErrorEventHandler(this.onSilentRenewError);
//     }

//     componentWillUnmount() {
//         console.log("Auth componentWillUnmount");
//         this.auth.eventManager.removeOnLoginSuccessEventHandler(this.onLoginSuccess);
//         this.auth.eventManager.removeOnLoginErrorEventHandler(this.onLoginFailure);
//         this.auth.eventManager.removeOnSilentRenewSuccessEventHandler(this.onSilentRenewSuccess);
//         this.auth.eventManager.removeOnSilentRenewErrorEventHandler(this.onSilentRenewError);
//     }

//     onLoginSuccess = (relativeReturnPath) => {
//         console.log("Auth Process Success. Now we need to redirect to path " + relativeReturnPath);
//         this.props.history.push(relativeReturnPath);
//     }

//     onLoginFailure = (error) => {
//         console.error("Error!");
//         console.error(error);
//         this.props.history.push("/Error");
//     }

//     onSilentRenewSuccess = () => {
//         console.log("SilentRenew Success");
//     }

//     onSilentRenewError = (error) => {
//         console.error(error);
//         console.error("SilentRenew failed");
//     }

//     render() {
//         return React.Children.only(this.props.children);
//     }
// }