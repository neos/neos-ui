import {takeEvery, put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * moveDroppedNode() {
    yield takeEvery(actionTypes.CR.Nodes.MOVE, function * handleNodeMove({payload}) {
        const {nodeToBeMoved: subject, targetNode: reference, position} = payload;

        yield put(actions.Changes.persistChanges([{
            type: calculateChangeTypeFromMode(position, 'Move'),
            subject,
            payload: calculateDomAddressesFromMode(
                position,
                reference
            )
        }]));
    });
}
