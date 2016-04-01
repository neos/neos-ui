import {Map} from 'immutable';
import {$set} from 'plow-js';

//
// Export the initial state hydrator
//
export const hydrate = () => $set(
    'user.name',
    new Map({
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        otherName: '',
        fullName: ''
    })
);

//
// Export the reducer
//
export const reducer = {};
