import * as types from '../actions/types';

const handlers = {
    [types.SET_AUTHENTICATED_USER]: (state = {}, user) => {
        return Object.assign({},
                state,
                {
                    user
                });
    },

    [types.REMOVE_AUTHENTICATED_USER]: (state = {}) => {
        return Object.assign({},
                state,
                {
                    user: null
                });   
    }
};

const initialState = {
    user: null
};

export function authReducer(state = initialState, action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action.payload) : state;
}

export default authReducer;