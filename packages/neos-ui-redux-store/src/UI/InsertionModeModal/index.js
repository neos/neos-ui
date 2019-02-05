import {createAction} from 'redux-actions';
import {Map} from 'immutable';
import {$set} from 'plow-js';

import {handleActions} from '@neos-project/utils-redux';
import {actionTypes as system} from '../../System/index';

const OPEN = '@neos/neos-ui/UI/InsertionModeModal/OPEN';
const CANCEL = '@neos/neos-ui/UI/InsertionModeModal/CANCEL';
const APPLY = '@neos/neos-ui/UI/InsertionModeModal/APPLY';

//
// Export the action types
//
export const actionTypes = {
    OPEN,
    CANCEL,
    APPLY
};

const open = createAction(OPEN, (subjectContextPath, referenceContextPath, enableAlongsideModes, enableIntoMode, operationType) => ({ // eslint-disable-line max-params
    subjectContextPath,
    referenceContextPath,
    enableAlongsideModes,
    enableIntoMode,
    operationType
}));
const cancel = createAction(CANCEL);
const apply = createAction(APPLY, mode => mode);

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
        'ui.insertionModeModal',
        new Map({
            isOpen: false,
            subjectContextPath: '',
            referenceContextPath: '',
            enableAlongsideModes: false,
            enableIntoMode: false,
            operationType: null
        })
    ),
    [OPEN]: ({subjectContextPath, referenceContextPath, enableAlongsideModes, enableIntoMode, operationType}) =>
        $set('ui.insertionModeModal', new Map({
            isOpen: true,
            subjectContextPath,
            referenceContextPath,
            enableAlongsideModes,
            enableIntoMode,
            operationType
        })),
    [CANCEL]: () => $set('ui.insertionModeModal', new Map({
        isOpen: false,
        subjectContextPath: '',
        referenceContextPath: '',
        enableAlongsideModes: false,
        enableIntoMode: false
    })),
    [APPLY]: () => $set('ui.insertionModeModal', new Map({
        isOpen: false,
        subjectContextPath: '',
        referenceContextPath: '',
        enableAlongsideModes: false,
        enableIntoMode: false
    }))
});
