import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from 'Shared/Utilities/index';
import {actionTypes as system} from 'Host/Redux/System/index';

const SET_CONTEXT = '@neos/neos-ui/Guest/SET_CONTEXT';

/**
 * Sets the current context of the guest frame.
 */
const setContext = createAction(SET_CONTEXT, node => ({node}));

//
// Export the actions
//
export const actions = {
    setContext
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'guest',
        new Map({
            nodeToolbar: new Map({
                isVisible: true
            }),

            //
            // Will be populated with the guests window object once the iframe loads.
            //
            context: null
        })
    ),
    [SET_CONTEXT]: ({node}) => $set('guest.context', node)
});
