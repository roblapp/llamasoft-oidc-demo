import axios from 'axios';

export function httpGetRequest(url, accessToken) {
    let requestConfig = {};

    console.log(`preparing http GET request to url ${url}`);

    if (accessToken) {
        console.log("Adding Bearer token to GET request");
        requestConfig['headers'] = { Authorization: `Bearer ${accessToken}` }
    }

    return axios.get(url, requestConfig);
}