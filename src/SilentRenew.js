import React from 'react';
import { connect } from 'react-redux';
import { getUserManager } from './actions/authActions';

class SilentRenew extends React.Component {
  componentWillMount () {
      this.props.completeSilentRenew();
  }

  render () {
    return <div>SilentRenew</div>
  }
}

// const mapStateToProps = (state) => {
//     return {}
// }

const mapDispatchToProps = (dispatch) => {
    return {
      completeSilentRenew: () => {
          const userManager = dispatch(getUserManager);
          userManager.signinSilentCallback().then(user => {
              console.log("Completed SilentRenew");
              // dispatch(setAuthenticatedUser(user));
          });
      }
    }
}

export default connect(null, mapDispatchToProps)(SilentRenew);