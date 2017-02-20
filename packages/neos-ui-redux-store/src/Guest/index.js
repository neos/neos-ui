import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set, $get} from 'plow-js';
import {createSelector} from 'reselect';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../System/index';

const SET_CONTEXT = '@neos/neos-ui/Guest/SET_CONTEXT';

/**
 * Sets the current context (DOM window) of the guest frame.
 */
const setContext = createAction(SET_CONTEXT, context => ({
    contextAccessorFunction: () => context
}));

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
            // HINT: if we store a reference towards a DOM node directly, this BREAKS
            // Redux-Devtools - it just waits forever probably because it tries to serialize the full DOM.
            // That's why "context" will contain a function; and when you call it (without) arguments
            // you get back the actual context value.
            context: () => null
        })
    ),
    [SET_CONTEXT]: ({contextAccessorFunction}) => $set('guest.context', contextAccessorFunction)
});

const contextSelector = createSelector(
    [
        $get('guest.context')
    ],
    contextAccessorFunction =>
        contextAccessorFunction()
);

//
// Export the selectors
//
export const selectors = {
    context: contextSelector
};
