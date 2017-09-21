import React from 'react';
import { connect } from 'react-redux';

export class Error extends React.Component {
    render() {
        return (
            <div>
                <h2>Error Page</h2>
                <p>
                An error occurred!
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Error);
