import {Map} from 'immutable';

//
// Export the initial state hydrator
//
export const hydrate = () => new Map({
    user: new Map({
        name: new Map({
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            otherName: '',
            fullName: ''
        })
    })
});

//
// Export the reducer
//
export const reducer = {};
