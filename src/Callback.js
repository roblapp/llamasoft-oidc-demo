import React, { Component } from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux';
import { getUserManager, setAuthenticatedUser } from './actions/authActions';
import { setApplicationError } from './actions/errorActions';
// import loading from './loading.svg';

class Callback extends Component {

  componentDidMount() {
      this.props.completeAuthProcess();
  }

  render() {
    return <div><code>/Callback</code></div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    completeAuthProcess: () => {
        console.log("setAuthenticatedUser");
        const userManager = dispatch(getUserManager);

        userManager.signinRedirectCallback()
          .then(user => {
              dispatch(setAuthenticatedUser(user));
              dispatch(push("/Landing"));

              userManager.events.addUserLoaded(user => {
                dispatch(setAuthenticatedUser(user));
              });

              userManager.events.addUserSignedOut(() => {
                alert("You have signed out of the OIDC provider");
                //Remove authenticated user
                userManager.removeUser()
                .then(() => {
                    dispatch(push("/"));
                }).catch(error => {
                    alert("Error occurred removing user");
                    dispatch(push("/"));
                });
              });
          })
          .catch(error => {
            console.log("before dispatch(setApplicationError(message));");
              const message = error.message ? error.message : 'An error has occurred';
              dispatch(setApplicationError(message));
              console.log("after dispatch(setApplicationError(message));");
              console.log("befpre dispatch(push(...));");
              dispatch(push("/Error"));
              console.log("after dispatch(push(...));");
          });
    }
  }
}

export default connect(null, mapDispatchToProps)(Callback);