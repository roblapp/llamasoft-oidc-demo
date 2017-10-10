import React, { Component } from 'react';
import loading from './loading.svg';

class Callback extends Component {

  componentDidMount() {
    this.props.auth.handleAuthorizeCallback()
      .then(x => x ? this.props.history.push(x) : this.props.history.push("/Landing"))
      .catch(error => alert(error));
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
