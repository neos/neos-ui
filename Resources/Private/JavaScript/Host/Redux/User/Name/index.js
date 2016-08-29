import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'user.name',
        new Map({
            title: '',
            firstName: $get('user.name.firstName', state) || '',
            middleName: $get('user.name.middleName', state) || '',
            lastName: $get('user.name.lastName', state) || '',
            otherName: $get('user.name.otherName', state) || '',
            fullName: $get('user.name.fullName', state) || ''
        })
    )
});
