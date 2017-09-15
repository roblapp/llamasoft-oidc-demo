import * as types from '../actions/types';

const handlers = {
    [types.GET_ALL_CLAIMS]: (state, data) => {
        return Object.assign({},
                state,
                {
                    data,
                    error: undefined
                });
    },

    [types.GET_ALL_CLAIMS_ERROR]: (state, error) => {
        return Object.assign({},
                state,
                {
                    data: undefined,
                    error
                });
    }
};

const initialState = { };

export function landingReducer(state = initialState, action) {
    const handler = handlers[action.type];
    return handler ? handler(state, action.payload) : state;
}

export default landingReducer;