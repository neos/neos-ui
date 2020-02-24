import {take, put, race} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

export default function * determineInsertMode(subjectContextPaths, referenceContextPath, canBeInsertedAlongside, canBeInsertedInto, operation) { // eslint-disable-line max-params
    if (canBeInsertedInto && !canBeInsertedAlongside) {
        return 'into';
    }

    yield put(actions.UI.InsertionModeModal.open(
        subjectContextPaths,
        referenceContextPath,
        canBeInsertedAlongside,
        canBeInsertedInto,
        operation
    ));
    const waitForNextAction = yield race([
        take(actionTypes.UI.InsertionModeModal.CANCEL),
        take(actionTypes.UI.InsertionModeModal.APPLY)
    ]);
    const nextAction = Object.values(waitForNextAction)[0];

    if (nextAction.type === actionTypes.UI.InsertionModeModal.CANCEL) {
        return;
    }

    return nextAction.payload;
}
