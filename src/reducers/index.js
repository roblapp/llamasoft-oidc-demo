import { combineReducers } from 'redux';
import landingReducer from './landingReducer';
import { reducer as oidcReducer } from 'redux-oidc';

const rootReducer = combineReducers({
    oidc: oidcReducer,
    landingPageData: landingReducer
});

export default rootReducer;
