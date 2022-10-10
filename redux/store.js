// import create store and apply middleware for asynchronous
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger';

// import reducer
import rootReducer from './reducer';

// logging for debugging
const logger = createLogger({});


// define store
const store = createStore(
    rootReducer,
    applyMiddleware(
        logger
    )
);

export default store;