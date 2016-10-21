import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'user.name',
        new Map({
            title: $get('user.name.title', state) || '',
            firstName: $get('user.name.firstName', state) || '',
            middleName: $get('user.name.middleName', state) || '',
            lastName: $get('user.name.lastName', state) || '',
            otherName: $get('user.name.otherName', state) || '',
            fullName: $get('user.name.fullName', state) || ''
        })
    )
});

//
// Export the selectors
//
export const selectors = {};
