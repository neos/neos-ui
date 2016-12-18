import {takeLatest, takeEvery} from 'redux-saga';
import {take, put, race, select, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {dom} from '../../../Containers/ContentCanvas/Helpers/index';

function * removeNodeIfConfirmed() {
    yield * takeLatest(actionTypes.CR.Nodes.COMMENCE_REMOVAL, function * waitForConfirmation() {
        const state = yield select();
        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.REMOVAL_ABORTED),
            take(actionTypes.CR.Nodes.REMOVAL_CONFIRMED)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.REMOVAL_ABORTED) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.REMOVAL_CONFIRMED) {
            const nodeToBeRemovedContextPath = $get('cr.nodes.toBeRemoved', state);

            yield put(actions.Changes.persistChange({
                type: 'Neos.Neos.Ui:RemoveNode',
                subject: nodeToBeRemovedContextPath
            }));
        }
    });
}

function * determineInsertMode(subjectContextPath, referenceContextPath, canBePastedAlongside, canBePastedInto) {
    if (canBePastedInto && !canBePastedAlongside) {
        return 'into';
    }

    yield put(actions.UI.InsertionModeModal.open(
        subjectContextPath,
        referenceContextPath,
        canBePastedAlongside,
        canBePastedInto
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

function * copyAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const {
        canBePastedAlongsideSelector,
        canBePastedIntoSelector
    } = selectors.CR.Nodes;
    const calculateChangeTypeFromMode = mode => {
        switch (mode) {
            case 'prepend':
                return 'Neos.Neos.Ui:CopyBefore';

            case 'append':
                return 'Neos.Neos.Ui:CopyAfter';

            default:
                return 'Neos.Neos.Ui:CopyInto';
        }
    };
    const calculateDomAddressesFromMode = (mode, contextPath, fusionPath) => {
        switch (mode) {
            case 'prepend':
            case 'append': {
                const parentElement = dom.closestNode(
                    dom.findNode(contextPath, fusionPath).parentNode
                );

                return {
                    siblingDomAddress: {
                        contextPath,
                        fusionPath
                    },
                    parentDomAddress: {
                        contextPath: parentElement.getAttribute('data-__neos-node-contextpath'),
                        fusionPath: parentElement.getAttribute('data-__neos-typoscript-path')
                    }
                };
            }

            default:
                return {
                    parentDomAddress: {
                        contextPath,
                        fusionPath
                    }
                };
        }
    };

    yield * takeEvery(actionTypes.CR.Nodes.COPY, function * waitForPaste() {
        const nodeToBePasted = yield select($get('cr.nodes.clipboard'));
        const getCanBePastedAlongside = yield select(canBePastedAlongsideSelector);
        const getCanBePastedInto = yield select(canBePastedIntoSelector);

        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.COPY),
            take(actionTypes.CR.Nodes.PASTE)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.COPY) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.PASTE) {
            const {contextPath, fusionPath} = nextAction.payload;
            const canBePastedArguments = [nodeToBePasted, contextPath, nodeTypesRegistry];
            const canBePastedAlongside = getCanBePastedAlongside(...canBePastedArguments);
            const canBePastedInto = getCanBePastedInto(...canBePastedArguments);

            const mode = yield call(
                determineInsertMode,
                nodeToBePasted,
                contextPath,
                canBePastedAlongside,
                canBePastedInto
            );

            if (mode) {
                yield put(actions.Changes.persistChange({
                    type: calculateChangeTypeFromMode(mode),
                    subject: nodeToBePasted,
                    payload: calculateDomAddressesFromMode(
                        mode,
                        contextPath,
                        fusionPath
                    )
                }));
            }

            //
            // Keep the loop runnning
            //
            yield put(actions.CR.Nodes.copy(nodeToBePasted));
        }
    });
}

export const sagas = [
    removeNodeIfConfirmed,
    copyAndPasteNode
];
