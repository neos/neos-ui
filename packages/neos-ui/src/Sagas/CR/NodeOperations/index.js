import {takeLatest, takeEvery} from 'redux-saga';
import {take, put, race, select, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {dom} from '../../../Containers/ContentCanvas/Helpers/index';
import style from '../../../Containers/ContentCanvas/style.css';

const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }

    const [path, context] = contextPath.split('@');

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

const {
    canBePastedAlongsideSelector,
    canBePastedIntoSelector
} = selectors.CR.Nodes;

const calculateDomAddressesFromMode = (mode, contextPath, fusionPath) => {
    switch (mode) {
        case 'before':
        case 'after': {
            const element = dom.findNode(contextPath, fusionPath);
            const parentElement = element ? dom.closestNode(element.parentNode) : null;

            return {
                siblingDomAddress: {
                    contextPath,
                    fusionPath
                },
                parentDomAddress: parentElement ? {
                    contextPath: parentElement.getAttribute('data-__neos-node-contextpath'),
                    fusionPath: parentElement.getAttribute('data-__neos-typoscript-path')
                } : {
                    contextPath: parentNodeContextPath(contextPath),
                    fusionPath: null
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
    const calculateChangeTypeFromMode = mode => {
        switch (mode) {
            case 'before':
                return 'Neos.Neos.Ui:CopyBefore';

            case 'after':
                return 'Neos.Neos.Ui:CopyAfter';

            default:
                return 'Neos.Neos.Ui:CopyInto';
        }
    };

    yield * takeEvery(actionTypes.CR.Nodes.COPY, function * waitForPaste() {
        const nodeToBePasted = yield select($get('cr.nodes.clipboard'));
        const getCanBePastedAlongside = yield select(canBePastedAlongsideSelector);
        const getCanBePastedInto = yield select(canBePastedIntoSelector);

        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.COPY),
            take(actionTypes.CR.Nodes.CUT),
            take(actionTypes.CR.Nodes.PASTE)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.COPY) {
            return;
        }

        if (nextAction.type === actionTypes.CR.Nodes.CUT) {
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

function * cutAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const calculateChangeTypeFromMode = mode => {
        switch (mode) {
            case 'before':
                return 'Neos.Neos.Ui:MoveBefore';

            case 'after':
                return 'Neos.Neos.Ui:MoveAfter';

            default:
                return 'Neos.Neos.Ui:MoveInto';
        }
    };

    yield * takeEvery(actionTypes.CR.Nodes.CUT, function * waitForPaste() {
        const nodeToBePasted = yield select($get('cr.nodes.clipboard'));
        const getCanBePastedAlongside = yield select(canBePastedAlongsideSelector);
        const getCanBePastedInto = yield select(canBePastedIntoSelector);

        const waitForNextAction = yield race([
            take(actionTypes.CR.Nodes.CUT),
            take(actionTypes.CR.Nodes.COPY),
            take(actionTypes.CR.Nodes.PASTE)
        ]);
        const nextAction = Object.values(waitForNextAction)[0];

        if (nextAction.type === actionTypes.CR.Nodes.CUT) {
            return;
        }

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
        }
    });
}

function * hideNode() {
    yield * takeLatest(actionTypes.CR.Nodes.HIDE, function * performPropertyChange(action) {
        const contextPath = action.payload;
        const domElement = dom.find(`[data-__neos-node-contextpath="${contextPath}"]`);

        if (domElement) {
            domElement.classList.add(style.markHiddenNodeAsHidden);
        }

        yield put(actions.Changes.persistChange({
            type: 'Neos.Neos.Ui:Property',
            subject: contextPath,
            payload: {
                propertyName: '_hidden',
                value: true
            }
        }));
    });
}

function * showNode() {
    yield * takeLatest(actionTypes.CR.Nodes.SHOW, function * performPropertyChange(action) {
        const contextPath = action.payload;
        const domElement = dom.find(`[data-__neos-node-contextpath="${contextPath}"]`);

        if (domElement) {
            domElement.classList.remove(style.markHiddenNodeAsHidden);
        }

        yield put(actions.Changes.persistChange({
            type: 'Neos.Neos.Ui:Property',
            subject: contextPath,
            payload: {
                propertyName: '_hidden',
                value: false
            }
        }));
    });
}

export const sagas = [
    removeNodeIfConfirmed,
    copyAndPasteNode,
    cutAndPasteNode,
    hideNode,
    showNode
];
