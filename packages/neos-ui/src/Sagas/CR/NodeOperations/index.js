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
    makeCanBeInsertedAlongsideSelector,
    makeCanBeInsertedIntoSelector
} = selectors.CR.Nodes;

const calculateChangeTypeFromMode = (mode, prefix) => {
    switch (mode) {
        case 'before':
            return `Neos.Neos.Ui:${prefix}Before`;

        case 'after':
            return `Neos.Neos.Ui:${prefix}After`;

        default:
            return `Neos.Neos.Ui:${prefix}Into`;
    }
};

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
                    fusionPath: parentElement.getAttribute('data-__neos-fusion-path')
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

function * determineInsertMode(subjectContextPath, referenceContextPath, canBeInsertedAlongside, canBeInsertedInto, operation) { // eslint-disable-line max-params
    if (canBeInsertedInto && !canBeInsertedAlongside) {
        return 'into';
    }

    yield put(actions.UI.InsertionModeModal.open(
        subjectContextPath,
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

function * copyAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = makeCanBeInsertedIntoSelector(nodeTypesRegistry);

    yield * takeEvery(actionTypes.CR.Nodes.COPY, function * waitForPaste() {
        const subject = yield select($get('cr.nodes.clipboard'));

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
            const {contextPath: reference, fusionPath} = nextAction.payload;
            const canBeInsertedAlongside = yield select(canBeInsertedAlongsideSelector, {subject, reference});
            const canBeInsertedInto = yield select(canBeInsertedIntoSelector, {subject, reference});

            const mode = yield call(
                determineInsertMode,
                subject,
                reference,
                canBeInsertedAlongside,
                canBeInsertedInto,
                actionTypes.CR.Nodes.COPY
            );

            if (mode) {
                yield put(actions.Changes.persistChange({
                    type: calculateChangeTypeFromMode(mode, 'Copy'),
                    subject,
                    payload: calculateDomAddressesFromMode(mode, reference, fusionPath)
                }));
            }

            //
            // Keep the loop runnning
            //
            yield put(actions.CR.Nodes.copy(subject));
        }
    });
}

function * cutAndPasteNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = makeCanBeInsertedIntoSelector(nodeTypesRegistry);

    yield * takeEvery(actionTypes.CR.Nodes.CUT, function * waitForPaste() {
        const subject = yield select($get('cr.nodes.clipboard'));

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
            const {contextPath: reference, fusionPath} = nextAction.payload;
            const canBeInsertedAlongside = yield select(canBeInsertedAlongsideSelector, {subject, reference});
            const canBeInsertedInto = yield select(canBeInsertedIntoSelector, {subject, reference});

            const mode = yield call(
                determineInsertMode,
                subject,
                reference,
                canBeInsertedAlongside,
                canBeInsertedInto,
                actionTypes.CR.Nodes.CUT
            );

            if (mode) {
                yield put(actions.Changes.persistChange({
                    type: calculateChangeTypeFromMode(mode, 'Move'),
                    subject,
                    payload: calculateDomAddressesFromMode(mode, reference, fusionPath)
                }));
            }
        }
    });
}

function * moveDroppedNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = makeCanBeInsertedIntoSelector(nodeTypesRegistry);

    yield * takeEvery(actionTypes.CR.Nodes.MOVE, function * handleNodeMove({payload}) {
        const {nodeToBeMoved: subject, targetNode: reference} = payload;
        const canBeInsertedAlongside = yield select(canBeInsertedAlongsideSelector, {subject, reference});
        const canBeInsertedInto = yield select(canBeInsertedIntoSelector, {subject, reference});

        const mode = yield call(
            determineInsertMode,
            subject,
            reference,
            canBeInsertedAlongside,
            canBeInsertedInto,
            actionTypes.CR.Nodes.MOVE
        );

        if (mode) {
            yield put(actions.Changes.persistChange({
                type: calculateChangeTypeFromMode(mode, 'Move'),
                subject,
                payload: calculateDomAddressesFromMode(
                    mode,
                    reference
                )
            }));
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
    moveDroppedNode,
    hideNode,
    showNode
];
