import Immutable from 'immutable';
import {handleActions} from 'redux-actions';

//
// Export the reducer
//
const initialState = Immutable.fromJS({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    otherName: '',
    fullName: ''
});

export const reducer = handleActions({}, initialState);

//
// Export the event map
//
export const events = {
};
