import {takeEvery} from 'redux-saga';
import {put, select, call} from 'redux-saga/effects';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import determineInsertMode from './determineInsertMode';
import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

export default function * moveDroppedNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
    const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeInsertedIntoSelector(nodeTypesRegistry);

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
