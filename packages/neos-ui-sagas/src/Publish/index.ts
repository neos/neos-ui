/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {put, call, select, takeEvery, take, race, all} from 'redux-saga/effects';

import {AnyError} from '@neos-project/neos-ui-error';
import {NodeContextPath, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {FeedbackEnvelope} from '@neos-project/neos-ui-redux-store/src/ServerFeedback';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import backend, {Routes} from '@neos-project/neos-ui-backend-connector';

import {makeReloadNodes} from '../CR/NodeOperations/reloadNodes';
import {updateWorkspaceInfo} from '../CR/Workspaces';

const handleWindowBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = true;
    return true;
};

type PublishingResponse =
    | {
        success: {
            numberOfAffectedChanges: number;
        }
    }
    | { error: AnyError };

export function * watchPublishing({routes}: {routes: Routes}) {
    const {endpoints} = backend.get();
    const ENDPOINT_BY_MODE_AND_SCOPE = {
        [PublishingMode.PUBLISH]: {
            [PublishingScope.SITE]:
                endpoints.publishChangesInSite,
            [PublishingScope.DOCUMENT]:
                endpoints.publishChangesInDocument
        },
        [PublishingMode.DISCARD]: {
            [PublishingScope.SITE]:
                endpoints.discardChangesInSite,
            [PublishingScope.DOCUMENT]:
                endpoints.discardChangesInDocument
        }
    };
    const SELECTORS_BY_SCOPE = {
        [PublishingScope.SITE]: {
            ancestorIdSelector: selectors.CR.Nodes.siteNodeContextPathSelector
        },
        [PublishingScope.DOCUMENT]: {
            ancestorIdSelector: selectors.CR.Nodes.documentNodeContextPathSelector
        }
    };

    const reloadAfterPublishing = makeReloadAfterPublishing({routes});

    yield takeEvery(actionTypes.CR.Publishing.STARTED, function * publishingWorkflow(action: ReturnType<typeof actions.CR.Publishing.start>) {
        const confirmed = yield * waitForConfirmation();
        if (!confirmed) {
            return;
        }

        const {scope, mode} = action.payload;
        const endpoint = ENDPOINT_BY_MODE_AND_SCOPE[mode][scope];
        const {ancestorIdSelector} = SELECTORS_BY_SCOPE[scope];

        const workspaceName: WorkspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);
        const ancestorId: NodeContextPath = yield select(ancestorIdSelector);

        do {
            try {
                window.addEventListener('beforeunload', handleWindowBeforeUnload);
                const result: PublishingResponse = yield call(endpoint, ancestorId, workspaceName);

                if ('success' in result) {
                    yield put(actions.CR.Publishing.succeed(result.success.numberOfAffectedChanges));
                    yield * reloadAfterPublishing();
                } else if ('error' in result) {
                    yield put(actions.CR.Publishing.fail(result.error));
                } else {
                    yield put(actions.CR.Publishing.fail(null));
                }
            } catch (error) {
                yield put(actions.CR.Publishing.fail(error as AnyError));
            } finally {
                window.removeEventListener('beforeunload', handleWindowBeforeUnload);
            }
        } while (yield * waitForRetry());

        yield put(actions.CR.Publishing.finish());
    });
}

function * waitForConfirmation() {
    const {confirmed}: {
        cancelled: ReturnType<typeof actions.CR.Publishing.cancel>;
        confirmed: ReturnType<typeof actions.CR.Publishing.confirm>;
    } = yield race({
        cancelled: take(actionTypes.CR.Publishing.CANCELLED),
        confirmed: take(actionTypes.CR.Publishing.CONFIRMED)
    });

    return Boolean(confirmed);
}

function * waitForRetry() {
    const {retried}: {
        acknowledged: ReturnType<typeof actions.CR.Publishing.acknowledge>;
        retried: ReturnType<typeof actions.CR.Publishing.retry>;
    } = yield race({
        acknowledged: take(actionTypes.CR.Publishing.ACKNOWLEDGED),
        retried: take(actionTypes.CR.Publishing.RETRIED)
    });

    return Boolean(retried);
}

const makeReloadAfterPublishing = (deps: {
    routes: Routes
}) => {
    const reloadNodes = makeReloadNodes(deps);

    function * reloadAfterPublishing() {
        yield all([
            call(updateWorkspaceInfo),
            call(reloadNodes)
        ]);
    }

    return reloadAfterPublishing;
}

export function * watchChangeBaseWorkspace() {
    const {changeBaseWorkspace} = backend.get().endpoints;
    yield takeEvery(actionTypes.CR.Workspaces.CHANGE_BASE_WORKSPACE, function * change(action: ReturnType<typeof actions.CR.Workspaces.changeBaseWorkspace>) {
        try {
            const documentNode: null | string = yield select(
                (state: GlobalState) => state?.cr?.nodes?.documentNode
            );

            if (documentNode) {
                const feedback: FeedbackEnvelope = yield call(changeBaseWorkspace, action.payload, documentNode);
                yield put(actions.ServerFeedback.handleServerFeedback(feedback));

                // Reload the page tree
                yield put(actions.CR.Nodes.reloadState());
            }
        } catch (error) {
            console.error('Failed to change base workspace', error);
        }
    });
}
