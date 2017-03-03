import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const OPEN = '@neos/neos-ui/UI/NodeCreationDialog/OPEN';
const BACK = '@neos/neos-ui/UI/NodeCreationDialog/BACK';
const CANCEL = '@neos/neos-ui/UI/NodeCreationDialog/CANCEL';
const APPLY = '@neos/neos-ui/UI/NodeCreationDialog/APPLY';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    BACK,
    CANCEL,
    APPLY
};

const open = createAction(OPEN, (label, configuration) => ({label, configuration}));
const back = createAction(BACK);
const cancel = createAction(CANCEL);
const apply = createAction(APPLY, data => data);

//
// Export the actions
//
export const actions = {
    open,
    back,
    cancel,
    apply
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.nodeCreationDialog',
        new Map({
            isOpen: false,
            label: '',
            configuration: null
        })
    ),
    [OPEN]: ({label, configuration}) => $set(
        'ui.nodeCreationDialog',
        new Map({
            isOpen: true,
            label,
            configuration
        })),
    [BACK]: () => $set(
        'ui.nodeCreationDialog',
        new Map({
            isOpen: false,
            label: '',
            configuration: null
        })),
    [CANCEL]: () => $set(
        'ui.nodeCreationDialog',
        new Map({
            isOpen: false,
            label: '',
            configuration: null
        })),
    [APPLY]: () => $set(
        'ui.nodeCreationDialog',
        new Map({
            isOpen: false,
            label: '',
            configuration: null
        }))
});
