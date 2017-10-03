import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {

  componentDidMount() {
    //this takes the id_token and access_token out of the URL hash and stores them in window.localStorage by deafult
    //You can override where they are stored by passing in a storage implementation
    this.props.auth
      .handleAuthorizeCallback(
          //Required. This is used to handle the post auth process. In almost every use case it is a redirect to one of two places
          //1) The original page the user was trying to access
          //2) A default landing page
          (relativeReturnPath) => {
            console.log("Auth Process Success. Now we need to redirect to path " + relativeReturnPath);
            this.props.history.push(relativeReturnPath);
          },

          //Required. This is used to handle errors that arise from the auth process. You can define whatever custom behavior you want
          (error) => {
            console.error("Error!");
            console.error(error);
            this.props.history.push("/Error");
          }

          // //Custom hook not required, just used as an example. A use case would be wanting to store the tokens in your redux store
          // (tokenKey, tokenValue) => {
          //   console.log("We have a hook into the auth process... specifically, once the id_token and access_tokens have been validated but before we perform the final redirect");
          //   console.log(`Mapping ${tokenKey} to ${tokenValue}`);
          // }
      );
  }

  render() {
    const iconStyle = {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '50vh',
        width: '100vw'
        // top: 0,
        // bottom: 0,
        // left: 0,
        // right: 0
    };
    
    return (
      <div style={iconStyle}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
