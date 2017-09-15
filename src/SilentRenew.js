import React, { Component } from 'react';
import { processSilentRenew } from 'redux-oidc';

class SilentRenew extends Component {
    componentWillMount() {
        console.log("Start processing silent renew");
        processSilentRenew();
        console.log("Done processing silent renew");
    }

    render() {
        console.log("SilentRenew::render()");
        
        return (
            <div>Silent Renew Page</div>
        );
    }
}


export default SilentRenew;
