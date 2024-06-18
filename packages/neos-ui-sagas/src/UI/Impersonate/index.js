import {call, takeEvery} from 'redux-saga/effects';

import {actionTypes} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {showFlashMessage} from '@neos-project/neos-ui-error';

export function * impersonateRestore({globalRegistry, routes}) {
    const {impersonateRestore} = backend.get().endpoints;
    const i18nRegistry = globalRegistry.get('i18n');

    yield takeEvery(actionTypes.User.Impersonate.RESTORE, function * restore(action) {
        const errorMessage = i18nRegistry.translate(
            'impersonate.error.restoreUser',
            'Could not switch back to the original user.',
            {},
            'Neos.Neos',
            'Main'
        );

        try {
            const feedback = yield call(impersonateRestore, action.payload);
            const originUser = feedback?.origin?.accountIdentifier;
            const user = feedback?.impersonate?.accountIdentifier;
            const status = feedback?.status;

            const restoreMessage = i18nRegistry.translate(
                'impersonate.success.restoreUser',
                'Switched back from {0} to the orginal user {1}.',
                {
                    0: user,
                    1: originUser
                },
                'Neos.Neos',
                'Main'
            );

            if (status) {
                showFlashMessage({
                    id: 'restoreUserImpersonateUser',
                    severity: 'success',
                    message: restoreMessage
                });
            } else {
                showFlashMessage({
                    id: 'restoreUserImpersonateUser',
                    severity: 'error',
                    message: errorMessage
                });
            }

            window.location.href = routes?.core?.modules?.defaultModule;
        } catch (error) {
            showFlashMessage({
                id: 'restoreUserImpersonateUser',
                severity: 'error',
                message: errorMessage
            });
        }
    });
}
