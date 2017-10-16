import * as types from '../actions/types';

const handlers = {
    [types.SET_APPLICATION_ERROR]: (state = {}, error) => {
        return Object.assign({},
                state,
                {
                    error
                });
    }
};

const initialState = {
    error: ''
};

export function errorReducer(state = initialState, action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action.payload) : state;
}

export default errorReducer;