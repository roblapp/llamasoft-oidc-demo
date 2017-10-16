import { combineReducers } from 'redux';
import landingReducer from './landingReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
    auth: authReducer,
    routing: routerReducer,
    landingPageData: landingReducer,
    errorData: errorReducer
});

export default rootReducer;
