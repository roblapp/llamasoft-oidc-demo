import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {

  componentDidMount() {
    this.props.auth.handleAuthorizeCallback(

      //Success callback
      (relativeReturnPath) => {
            console.log("Auth Process Success. Now we need to redirect to path " + relativeReturnPath);
            this.props.history.push(relativeReturnPath);
        },

        //Error callback
        (error) => {
            console.error("Error!");
            console.error(error);
            this.props.history.push("/Error");
        },

        //Hook into process that stores idToken and accessToken
        (tokenKey, tokenValue) => {}
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
    };
    
    return (
      <div style={iconStyle}>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}

export default Callback;
