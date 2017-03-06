import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$get, $set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const OPEN = '@neos/neos-ui/UI/NodeVariantCreationDialog/OPEN';
const CANCEL = '@neos/neos-ui/UI/NodeVariantCreationDialog/CANCEL';
const CREATE_EMPTY = '@neos/neos-ui/UI/NodeVariantCreationDialog/CREATE_EMPTY';
const CREATE_AND_COPY = '@neos/neos-ui/UI/NodeVariantCreationDialog/CREATE_AND_COPY';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CANCEL,
    CREATE_EMPTY,
    CREATE_AND_COPY
};

const open = createAction(OPEN, numberOfParentNodesToBeCreated => ({numberOfParentNodesToBeCreated}));
const cancel = createAction(CANCEL);
const createEmpty = createAction(CREATE_EMPTY);
const createAndCopy = createAction(CREATE_AND_COPY);

//
// Export the actions
//
export const actions = {
    open,
    cancel,
    createEmpty,
    createAndCopy
};

//
// Export the reducer
//
export const reducer = handleActions({
    [system.INIT]: () => $set(
        'ui.nodeVariantCreationDialog',
        new Map({
            isOpen: false,
            numberOfParentNodesToBeCreated: 0
        })
    ),
    [OPEN]: ({numberOfParentNodesToBeCreated}) => $set(
        'ui.nodeVariantCreationDialog',
        new Map({
            isOpen: true,
            numberOfParentNodesToBeCreated
        })
    ),
    [CANCEL]: () => $set(
        'ui.nodeVariantCreationDialog',
        new Map({
            isOpen: false,
            numberOfParentNodesToBeCreated: 0
        })
    ),
    [CREATE_EMPTY]: () => $set(
        'ui.nodeVariantCreationDialog',
        new Map({
            isOpen: false
        })
    ),
    [CREATE_AND_COPY]: () => $set(
        'ui.nodeVariantCreationDialog',
        new Map({
            isOpen: false
        })
    )
});

export const selectors = {
    isOpen: $get('ui.nodeVariantCreationDialog.isOpen'),
    numberOfParentNodesToBeCreated: $get('ui.nodeVariantCreationDialog.numberOfParentNodesToBeCreated')
};
