import {createAction} from 'redux-actions';
import {$set, $add, $get} from 'plow-js';

const TEST = 'mytestaction';

//
// Export the initial state
//
export const initialState = {
    myvar: 'test'
};

//
// Export the reducer
//
export const reducer = {
    [TEST]: state => state
};
