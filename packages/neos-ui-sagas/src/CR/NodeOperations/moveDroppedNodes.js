import {takeEvery, put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * moveDroppedNodes() {
    yield takeEvery(actionTypes.CR.Nodes.MOVE_MULTIPLE, function * handleNodeMove({payload}) {
        const {nodesToBeMoved, targetNode: reference, position} = payload;
        const changes = nodesToBeMoved.map(subject => ({
            type: calculateChangeTypeFromMode(position, 'Move'),
            subject,
            payload: calculateDomAddressesFromMode(
                position,
                reference
            )
        }));

        yield put(actions.Changes.persistChanges(changes));
    });
}
