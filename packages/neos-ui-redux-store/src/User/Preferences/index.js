import {Map} from 'immutable';
import {$set, $get} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: state => $set(
        'user.preferences',
        new Map({
            interfaceLanguage: String($get('user.preferences.interfaceLanguage', state))
        })
    )
});

//
// Export the selectors
//
export const selectors = {};
