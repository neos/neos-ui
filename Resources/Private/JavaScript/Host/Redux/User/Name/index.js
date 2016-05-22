import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'user.name',
        new Map({
            title: '',
            firstName: '',
            middleName: '',
            lastName: '',
            otherName: '',
            fullName: ''
        })
    )
});
