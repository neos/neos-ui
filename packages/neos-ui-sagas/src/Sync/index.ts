/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {put, call, takeEvery, race, take, select} from 'redux-saga/effects';

import {DimensionCombination, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {AnyError} from '@neos-project/neos-ui-error';
import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';
import backend from '@neos-project/neos-ui-backend-connector';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {Conflict, ResolutionStrategy} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';
import {WorkspaceInformation} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

// @TODO: This is a helper to gain type access to the available backend endpoints.
// It shouldn't be necessary to do this, and this hack should be removed once a
// better type API is available
import {default as Endpoints, Routes} from '@neos-project/neos-ui-backend-connector/src/Endpoints';
type Endpoints = ReturnType<typeof Endpoints>;

import {makeReloadNodes} from '../CR/NodeOperations/reloadNodes';

const handleWindowBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = true;
    return true;
};

type SyncWorkspaceResult =
    | { success: true }
    | { conflicts: Conflict[] }
    | { error: AnyError };

export function * watchSyncing({routes}: {routes: Routes}) {
    const syncPersonalWorkspace = makeSyncPersonalWorkspace({routes});

    yield takeEvery(actionTypes.CR.Syncing.STARTED, function * sync() {
        if (yield * waitForConfirmation()) {
            do {
                yield * syncPersonalWorkspace(false);
            } while (yield * waitForRetry());

            yield put(actions.CR.Syncing.finish());
        }
    });
}

function * waitForConfirmation() {
    const {confirmed}: {
        cancelled: null | ReturnType<typeof actions.CR.Syncing.cancel>;
        confirmed: null | ReturnType<typeof actions.CR.Syncing.confirm>;
    } = yield race({
        cancelled: take(actionTypes.CR.Syncing.CANCELLED),
        confirmed: take(actionTypes.CR.Syncing.CONFIRMED)
    });

    return Boolean(confirmed);
}

const makeSyncPersonalWorkspace = (deps: {
    routes: Routes
}) => {
    const refreshAfterSyncing = makeRefreshAfterSyncing(deps);
    const resolveConflicts = makeResolveConflicts({syncPersonalWorkspace});

    function * syncPersonalWorkspace(force: boolean) {
        const {syncWorkspace} = backend.get().endpoints as Endpoints;
        const personalWorkspaceName: WorkspaceName = yield select(selectors.CR.Workspaces.personalWorkspaceNameSelector);
        const dimensionSpacePoint: null|DimensionCombination = yield select(selectors.CR.ContentDimensions.active);

        try {
            window.addEventListener('beforeunload', handleWindowBeforeUnload);
            const result: SyncWorkspaceResult = yield call(syncWorkspace, personalWorkspaceName, force, dimensionSpacePoint);
            if ('success' in result) {
                yield * refreshAfterSyncing();
                yield put(actions.CR.Syncing.succeed());
            } else if ('conflicts' in result) {
                yield * resolveConflicts(result.conflicts);
            } else {
                yield put(actions.CR.Syncing.fail(result.error));
            }
        } catch (error) {
            yield put(actions.CR.Syncing.fail(error as AnyError));
        } finally {
            window.removeEventListener('beforeunload', handleWindowBeforeUnload);
        }
    }

    return syncPersonalWorkspace;
}

const makeResolveConflicts = (deps: {
    syncPersonalWorkspace: ReturnType<typeof makeSyncPersonalWorkspace>
}) => {
    const discardAll = makeDiscardAll(deps);

    function * resolveConflicts(conflicts: Conflict[]): any {
        yield put(actions.CR.Syncing.resolve(conflicts));

        yield takeEvery<ReturnType<typeof actions.CR.Syncing.selectResolutionStrategy>>(
            actionTypes.CR.Syncing.RESOLUTION_STARTED,
            function * resolve({payload: {strategy}}) {
                if (strategy === ResolutionStrategy.FORCE) {
                    if (yield * waitForResolutionConfirmation()) {
                        yield * deps.syncPersonalWorkspace(true);
                    }
                } else if (strategy === ResolutionStrategy.DISCARD_ALL) {
                    yield * discardAll();
                }
            }
        );
    }

    return resolveConflicts;
}

function * waitForResolutionConfirmation() {
    const {confirmed}: {
        cancelled: null | ReturnType<typeof actions.CR.Syncing.cancelResolution>;
        confirmed: null | ReturnType<typeof actions.CR.Syncing.confirmResolution>;
    } = yield race({
        cancelled: take(actionTypes.CR.Syncing.RESOLUTION_CANCELLED),
        confirmed: take(actionTypes.CR.Syncing.RESOLUTION_CONFIRMED)
    });

    return Boolean(confirmed);
}

function * waitForRetry() {
    const {retried}: {
        acknowledged: null | ReturnType<typeof actions.CR.Syncing.acknowledge>;
        retried: null | ReturnType<typeof actions.CR.Syncing.retry>;
    } = yield race({
        acknowledged: take(actionTypes.CR.Syncing.ACKNOWLEDGED),
        retried: take(actionTypes.CR.Syncing.RETRIED)
    });

    return Boolean(retried);
}

const makeDiscardAll = (deps: {
    syncPersonalWorkspace: ReturnType<typeof makeSyncPersonalWorkspace>;
}) => {
    function * discardAll() {
        yield put(actions.CR.Publishing.start(
            PublishingMode.DISCARD,
            PublishingScope.ALL
        ));

        const {cancelled, failed}: {
            cancelled: null | ReturnType<typeof actions.CR.Publishing.cancel>;
            failed: null | ReturnType<typeof actions.CR.Publishing.fail>;
            finished: null | ReturnType<typeof actions.CR.Publishing.finish>;
        } = yield race({
            cancelled: take(actionTypes.CR.Publishing.CANCELLED),
            failed: take(actionTypes.CR.Publishing.FAILED),
            finished: take(actionTypes.CR.Publishing.FINISHED)
        });

        if (cancelled) {
            yield put(actions.CR.Syncing.cancelResolution());
        } else if (failed) {
            yield put(actions.CR.Syncing.finish());
        } else {
            yield put(actions.CR.Syncing.confirmResolution());
            yield * deps.syncPersonalWorkspace(false);
        }
    }

    return discardAll;
}

const makeRefreshAfterSyncing = (deps: {
    routes: Routes
}) => {
    const {getWorkspaceInfo} = backend.get().endpoints as Endpoints;
    const reloadNodes = makeReloadNodes(deps);

    function * refreshAfterSyncing() {
        const workspaceInfo: WorkspaceInformation = yield call(getWorkspaceInfo);
        yield put(actions.CR.Workspaces.update(workspaceInfo));

        yield * reloadNodes();
    }

    return refreshAfterSyncing;
}
