import Immutable from 'immutable';
import {handleActions} from 'redux-actions';
const initialState = Immutable.fromJS({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    otherName: '',
    fullName: ''
});

export default handleActions({}, initialState);
