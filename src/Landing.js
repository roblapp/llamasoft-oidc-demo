import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from './actions/landingPageActions';
import ConfigurationService from './config/ConfigurationService';
import './Landing.css';

export class Landing extends React.Component {
    constructor(props) {
        super(props);

        this.configService = new ConfigurationService();

        this.onApiClick = this.onApiClick.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.renderError = this.renderError.bind(this);
        this.renderApplicationMetadata = this.renderApplicationMetadata.bind(this);
        this.renderOpenIdConnectData = this.renderOpenIdConnectData.bind(this);
    }

    onApiClick() {
        this.props.getAllClaims();
    }

    renderBody() {
        if (this.props.data) {
            return (
                <div>
                    <h2>Data From The Server</h2>
                    <pre>{JSON.stringify(this.props.data, null, 2)}</pre>
                </div>
            );
        }
        return null;
    }

    renderError() {
        return (
                <div>
                    <h2>An error occurred calling the API</h2>
                    <pre>
                        {JSON.stringify(this.props.error, null, 2)}
                    </pre>
                </div>
            );
    }

    renderApplicationMetadata() {
        const authority = this.configService.getAuthorityUrl();
        const clientId = this.configService.getClientId();
        const redirectUrl = this.configService.getRedirectUrl();
        const responseType = this.configService.getAuthResponseType();
        const scopes = this.configService.getRequestedScopes();
        const postLogoutRedirectUrl = this.configService.getPostLogoutRedirectUrl();

        const metadata = {
            authority,
            clientId,
            redirectUrl,
            responseType,
            scopes,
            postLogoutRedirectUrl
        };

        return (
                <div>
                    <h2>Application Metadata</h2>
                    <pre>
                        {JSON.stringify(metadata, null, 2)}
                    </pre>
                </div>
            );
    }

    renderOpenIdConnectData() {
        return (
                <div>
                    <h2>OpenID Connect Data</h2>
                    <pre>
                        {JSON.stringify(this.props.oidc, null, 2)}
                    </pre>
                </div>
            );
    }

    render() {
        return (
            <div>
                <div className="row pad-row">
                    <Button bsStyle="primary" onClick={this.onApiClick}>Call Protected API</Button>
                </div>
                <div className="row pad-row">
                    <div className="col-xs-6">
                        {this.props.error && this.props.error !== '' ?
                            this.renderError()
                            :
                            this.renderBody()
                        }
                    </div>
                    <div className="col-xs-6">
                        {this.renderApplicationMetadata()}
                        {this.renderOpenIdConnectData()}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
      data: state.landingPageData.data,
      error: state.landingPageData.error,
      oidc: state.oidc
    };
}

const mapDispatchToProps = { ...actions };

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
