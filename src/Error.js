import React from 'react';
import { connect } from 'react-redux';

export class Error extends React.Component {
    renderError() {
        return (
            <div>
                <h2>An Error Has Occurred</h2>
                {this.props.errorData ? (
                    <pre>
                        {JSON.stringify(this.props.errorData, null, 2)}
                    </pre>
                ) : (
                    <pre>
                        {JSON.stringify({errorMessage: "An unknown error has occurred"}, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="App">
                <div className="App-content">
                    <div className="row">
                        <div className="col-xs-6">
                            <h3>Route: <code>{this.props.location.pathname}</code></h3>
                        </div>
                        <div className="col-xs-6">
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6">
                            {this.renderError()}
                        </div>
                        <div className="col-xs-6">
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return { };
}

function mapStateToProps(state) {
    return {
        errorData: state.errorData
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Error);
