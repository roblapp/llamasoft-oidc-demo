import * as types from './types';
import {httpGetRequest} from './httpActions';

export function getAllClaims(accessToken) {
    return function(dispatch) {
        httpGetRequest('http://localhost:5001/identity', accessToken)
            .then(response => {
                dispatch({
                        type: types.GET_ALL_CLAIMS,
                        payload: response.data
                    });
            }).catch(error => {
                dispatch({
                        type: types.GET_ALL_CLAIMS_ERROR,
                        payload: error
                    });
            });
    };
}