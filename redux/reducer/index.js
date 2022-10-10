import { combineReducers } from 'redux';

// import all reducers
import root from './root';

// combine them
const appReducer = combineReducers({
    root
})

export default appReducer;