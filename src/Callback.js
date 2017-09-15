import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Callback extends React.Component {

    successCallback = (user) => {
        console.log("Invoking success callback");
        console.log(user);
        this.props.history.push("/Landing");
    }

    errorCallback = (error) => {
        console.log("Callback error");
        console.log(error);
        alert("Callback error");
        this.props.history.push("/");
    }

    componentDidMount() {
        console.log("Callback::componentDidMount()");
        alert("/Callback componentDidMount");
        this.props.userManager.signinRedirectCallback()
            .then((user) => this.successCallback(user))
            .catch((error) => this.errorCallback(error));
    }

    render() {
        console.log("Callback::render()");
        return (
            <div>
                <h2>Callback Page</h2>
            </div>
        );
    }
}

Callback.propTypes = {
    userManager: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {};
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Callback);
