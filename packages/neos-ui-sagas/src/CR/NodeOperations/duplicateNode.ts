import {put, select, takeEvery} from 'redux-saga/effects';
import {ActionType} from 'typesafe-actions';

import {actions, actionTypes, GlobalState, selectors} from '@neos-project/neos-ui-redux-store';
import {ClipboardMode, InsertPosition} from '@neos-project/neos-ts-interfaces';
import {NodeType, Node} from '@neos-project/neos-ui-contentrepository-model';
import {GlobalRegistry} from '@neos-project/neos-ui-registry';

// @ts-ignore
import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

type DuplicateAction = ActionType<typeof actions.CR.Nodes.duplicate>;

export default function * duplicateNode({globalRegistry}: { globalRegistry: GlobalRegistry }) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeCopiedAlongsideSelector(nodeTypesRegistry);

    yield takeEvery(actionTypes.CR.Nodes.DUPLICATE, function * waitForDuplication(action: DuplicateAction) {
        const {contextPath: subject, fusionPath} = action.payload;
        const state: GlobalState = yield select();
        const canBeInsertedAlongside = canBeInsertedAlongsideSelector(state, {subject, reference: subject, role: 'content'});

        if (canBeInsertedAlongside) {
            const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(subject);
            const referenceNode: Node = yield select(referenceNodeSelector);
            const baseNodeType: NodeType = yield select(
                (state: GlobalState) => state?.ui?.pageTree?.filterNodeType
            );

            const changes = [{
                type: calculateChangeTypeFromMode(InsertPosition.AFTER, ClipboardMode.COPY),
                subject,
                payload: {
                    ...calculateDomAddressesFromMode(InsertPosition.AFTER, referenceNode, fusionPath),
                    baseNodeType
                }
            }];
            yield put(actions.Changes.persistChanges(changes));
        }
    });
}
