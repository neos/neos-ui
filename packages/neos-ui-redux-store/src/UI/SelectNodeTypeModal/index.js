import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const OPEN = '@neos/neos-ui/UI/SelectNodeTypeModal/OPEN';
const CANCEL = '@neos/neos-ui/UI/SelectNodeTypeModal/CANCEL';
const APPLY = '@neos/neos-ui/UI/SelectNodeTypeModal/APPLY';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CANCEL,
    APPLY
};

const open = createAction(OPEN, referenceNodeContextPath => referenceNodeContextPath);
const cancel = createAction(CANCEL);
const apply = createAction(APPLY, (mode, nodeType) => ({mode, nodeType}));

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    apply
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.selectNodeTypeModal',
        new Map({
            isOpen: false,
            referenceNodeContextPath: ''
        })
    ),
    [OPEN]: referenceNodeContextPath =>
        $set('ui.selectNodeTypeModal', new Map({
            isOpen: true,
            referenceNodeContextPath
        })),
    [CANCEL]: () => $set('ui.selectNodeTypeModal', new Map({
        isOpen: false,
        referenceNodeContextPath: ''
    })),
    [APPLY]: () => $set('ui.selectNodeTypeModal', new Map({
        isOpen: false,
        referenceNodeContextPath: ''
    }))
});
