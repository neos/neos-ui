import {createAction} from 'redux-actions';
import {$all, $get, $set, $drop, $toggle} from 'plow-js';
import Immutable, {Map} from 'immutable';

import {handleActions} from '@neos-project/utils-redux';

import {actionTypes as system} from '../../System/index';
import {selectors as nodes} from '../../CR/Nodes/index';

import * as selectors from './selectors.js';

//
// System actions
//
const COMMIT = '@neos/neos-ui/UI/Inspector/COMMIT';
const CLEAR = '@neos/neos-ui/UI/Inspector/CLEAR';

//
// User actions, which are handled by a saga
//
const APPLY = '@neos/neos-ui/UI/Inspector/APPLY';
const DISCARD = '@neos/neos-ui/UI/Inspector/DISCARD';
const ESCAPE = '@neos/neos-ui/UI/Inspector/ESCAPE';
const RESUME = '@neos/neos-ui/UI/Inspector/RESUME';

//
// Actions to control the secondary inspector window
//
const SECONDARY_OPEN = '@neos/neos-ui/UI/Inspector/SECONDARY_OPEN';
const SECONDARY_CLOSE = '@neos/neos-ui/UI/Inspector/SECONDARY_CLOSE';
const SECONDARY_TOGGLE = '@neos/neos-ui/UI/Inspector/SECONDARY_TOGGLE';

//
// Export the action types
//

export const actionTypes = {
    COMMIT,
    CLEAR,
    APPLY,
    DISCARD,
    ESCAPE,
    RESUME,
    SECONDARY_OPEN,
    SECONDARY_CLOSE,
    SECONDARY_TOGGLE
};

const commit = createAction(COMMIT, (propertyId, value, hooks) => ({propertyId, value, hooks}));
const clear = createAction(CLEAR);

const apply = createAction(APPLY);
const discard = createAction(DISCARD);
const escape = createAction(ESCAPE);
const resume = createAction(RESUME);

const openSecondaryInspector = createAction(SECONDARY_OPEN);
const closeSecondaryInspector = createAction(SECONDARY_CLOSE);
const toggleSecondaryInspector = createAction(SECONDARY_TOGGLE);

//
// Export the actions
//
export const actions = {
    commit,
    clear,
    apply,
    discard,
    escape,
    resume,
    openSecondaryInspector,
    closeSecondaryInspector,
    toggleSecondaryInspector
};

const clearReducer = () => state => {
    const focusedNodePath = nodes.focusedNodePathSelector(state);
    return $all(
        $set('ui.inspector.shouldPromptToHandleUnappliedChanges', false),
        $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath]),
        state
    );
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.inspector',
        new Map({
            shouldPromptToHandleUnappliedChanges: false,
            secondaryInspectorIsOpen: false,
            valuesByNodePath: new Map()
        })
    ),
    [COMMIT]: ({propertyId, value, hooks}) => state => {
        const focusedNode = nodes.focusedSelector(state);
        const focusedNodePath = $get('contextPath', focusedNode);
        const currentPropertyValue = $get(['properties', propertyId], focusedNode);
        const setValueForProperty = (data, state) =>
            $set(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], data, state);
        const transientValueDiffers = (value !== null) && (value !== currentPropertyValue);

        if (transientValueDiffers && hooks) {
            return setValueForProperty(Immutable.fromJS({value, hooks}), state);
        }

        if (transientValueDiffers) {
            return setValueForProperty(Immutable.fromJS({value}), state);
        }

        return $drop(['ui', 'inspector', 'valuesByNodePath', focusedNodePath, propertyId], state);
    },

    [DISCARD]: clearReducer,
    [CLEAR]: clearReducer,
    [ESCAPE]: () => $set('ui.inspector.shouldPromptToHandleUnappliedChanges', true),
    [RESUME]: () => $set('ui.inspector.shouldPromptToHandleUnappliedChanges', false),

    [SECONDARY_OPEN]: () => $set('ui.inspector.secondaryInspectorIsOpen', true),
    [SECONDARY_CLOSE]: () => $set('ui.inspector.secondaryInspectorIsOpen', false),
    [SECONDARY_TOGGLE]: () => $toggle('ui.inspector.secondaryInspectorIsOpen')
});

//
// Export the selectors
//

export {selectors};
