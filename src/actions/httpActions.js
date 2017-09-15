import axios from 'axios';

export function httpGetRequest(url, state, includeAuthenticationHeader) {
    let requestConfig = {};

    console.log(`preparing http GET request to url ${url}`);

    if (includeAuthenticationHeader) {
        console.log(`Added Bearer token '${state.oidc.user.access_token}'`);
        requestConfig['headers'] = { Authorization: `Bearer ${state.oidc.user.access_token}` }
    }

    return axios.get(url, requestConfig);
}