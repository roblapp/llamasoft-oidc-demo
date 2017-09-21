import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Callback extends React.Component {
    
    componentDidMount() {
        console.log("Callback::componentDidMount()");
        // alert("/Callback componentDidMount");
        this.props.userManager.signinRedirectCallback()
            .then((user) => {
                console.log("Success callback invoked");
                console.log(user);
                this.props.history.push("/Landing");
            })
            .catch((error) => {
                console.log("Error callback invoked");
                console.log(error);
                this.props.history.push("/");
            });
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
