import * as types from './types';
import {httpGetRequest} from './httpActions';

export function getAllClaims() {
    return function(dispatch, getState) {
        httpGetRequest('http://localhost:5001/identity', getState(), true)
            .then(function(response) {
                dispatch({
                        type: types.GET_ALL_CLAIMS,
                        payload: response.data
                    });
            }).catch(function(error) {
                dispatch({
                        type: types.GET_ALL_CLAIMS_ERROR,
                        payload: error
                    });
            });
    };
}