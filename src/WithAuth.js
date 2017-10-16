import React from 'react';
import { connect } from 'react-redux';
import { getUserManager } from './actions/authActions';

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      getUserManager: () => {
        console.log("getUserManager dispatched in withAuth");
        return dispatch(getUserManager);
      }
    }
}

//Any component passed in hee will have getUserManager() as a props as well as auth
export default (BaseComponent) => connect(mapStateToProps, mapDispatchToProps)(props => {
    console.log("Inside withAuth");
    // console.dir(props);
    if (!props.auth || !props.auth.user || !props.auth.user.access_token) {
        console.log("No session found... redirecting");
        // TODO: get the current route params, and store/tell the oidc provider what to send back
        props.getUserManager().signinRedirect();
        return null;
    } else {
        console.log("Rendering base component");
        return (<BaseComponent {...props} />);
    }
});