import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Home extends React.Component {

    render() {
        const authOptions = this.props.auth.getAuthOptions();

        const locationData = {
            hash: window.location.hash,
            host: window.location.host,
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            port: window.location.port,
            protocol: window.location.protocol,
            search: window.location.search
        };

        return (
            <div>
                <h2>Home Page</h2>
                <pre>
                    {JSON.stringify(authOptions, null, 2)}
                </pre>
                <pre>
                    {JSON.stringify(locationData, null, 2)}
                </pre>
            </div>
        );
    }
}

Home.propTypes = {
    auth: PropTypes.object,
    authOptions: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return { };
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
