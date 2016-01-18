import {handleActions} from 'redux-actions';
const initialState = {
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    otherName: '',
    fullName: ''
};

export default handleActions({}, initialState);
