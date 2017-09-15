import React from 'react';
import { connect } from 'react-redux';
import ConfigurationService from './config/ConfigurationService';

export class Home extends React.Component {
    render() {
        const configService = new ConfigurationService();
        
        const json = {
            apiUrl: configService.getApiUrl(),
            authorityUrl: configService.getAuthorityUrl(),
            redirectUrl: configService.getRedirectUrl(),
            isProduction: configService.isProductionEnv()
        };
        
        return (
            <div>
                <h2>Home Page</h2>
                <pre>
                    {JSON.stringify(json, null, 2)}
                </pre>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return { };
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
