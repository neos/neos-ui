import {takeLatest} from 'redux-saga';
import {put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {markNodeAsVisible} from '@neos-project/neos-ui-guest-frame/src/dom';

export default function * showNode() {
    yield * takeLatest(actionTypes.CR.Nodes.SHOW, function * performPropertyChange(action) {
        const contextPath = action.payload;

        markNodeAsVisible(contextPath);

        yield put(actions.Changes.persistChanges([{
            type: 'Neos.Neos.Ui:Property',
            subject: contextPath,
            payload: {
                propertyName: '_hidden',
                value: false
            }
        }]));
    });
}
