import {takeEvery, put, select} from 'redux-saga/effects';

import {actions, actionTypes, selectors} from '@neos-project/neos-ui-redux-store';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * moveDroppedNodes() {
    yield takeEvery(actionTypes.CR.Nodes.MOVE_MULTIPLE, function * handleNodeMove({payload}) {
        const {nodesToBeMoved, targetNode: reference, position} = payload;

        const referenceNodeSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(reference);
        const referenceNode = yield select(referenceNodeSelector);

        const changes = nodesToBeMoved.map(subject => ({
            type: calculateChangeTypeFromMode(position, 'Move'),
            subject,
            payload: calculateDomAddressesFromMode(
                position,
                referenceNode
            )
        }));

        yield put(actions.Changes.persistChanges(changes));
    });
}
