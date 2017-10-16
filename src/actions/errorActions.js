import * as types from './types';

export const setApplicationError = error => ({
  type: types.SET_APPLICATION_ERROR,
  payload: error
});

export default setApplicationError;