import * as types from './types';

export const getUserManager = (dispatch, getState, { UserManager }) => UserManager;

export const setAuthenticatedUser = user => ({
  type: types.SET_AUTHENTICATED_USER,
  payload: user
});

export const removeAuthenticatedUser = () => ({
    type: types.REMOVE_AUTHENTICATED_USER
});
