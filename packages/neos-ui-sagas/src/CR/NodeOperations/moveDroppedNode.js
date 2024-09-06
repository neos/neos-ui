import {takeEvery, put, select} from 'redux-saga/effects';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

/**
 * @deprecated `moveDroppedNodes` should be used
 */
export default function * moveDroppedNode() {
    yield takeEvery(actionTypes.CR.Nodes.MOVE, function * handleNodeMove({payload}) {
        const {nodeToBeMoved: subject, targetNode: reference, position} = payload;

        const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(reference);
        const referenceNode = yield select(referenceNodeSelector);
        const baseNodeType = yield select(
            state => state?.ui?.pageTree?.filterNodeType
        );

        yield put(actions.Changes.persistChanges([{
            type: calculateChangeTypeFromMode(position, 'Move'),
            subject,
            payload: {
                ...calculateDomAddressesFromMode(
                    position,
                    referenceNode
                ),
                baseNodeType
            }
        }]));
    });
}
