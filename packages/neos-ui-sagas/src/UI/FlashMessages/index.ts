/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {takeEvery} from 'redux-saga/effects';

import {actionTypes, actions} from '@neos-project/neos-ui-redux-store';
import {Severity, showFlashMessage} from '@neos-project/neos-ui-error';

export function * legacy__redirectReduxFlashMessagesToHighLevelApiCall() {
    yield takeEvery(
        actionTypes.UI.FlashMessages.ADD,
        function restore(
            action: ReturnType<typeof actions.UI.FlashMessages.add>
        ) {
            showFlashMessage({
                id: action.payload.id,
                message: action.payload.message,
                severity: action.payload.severity.toLowerCase() as Severity,
                timeout: action.payload.timeout
            });
        }
    );
}
