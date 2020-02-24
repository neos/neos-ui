import {takeLatest, put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {markNodeAsVisible} from '@neos-project/neos-ui-guest-frame/src/dom';

export default function * showNode() {
    yield takeLatest(actionTypes.CR.Nodes.SHOW, function * performPropertyChange(action) {
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
    yield takeLatest(actionTypes.CR.Nodes.SHOW_MULTIPLE, function * performPropertyChange(action) {
        const contextPaths = action.payload;
        const changes = [...contextPaths].map(contextPath => {
            markNodeAsVisible(contextPath);
            return {
                type: 'Neos.Neos.Ui:Property',
                subject: contextPath,
                payload: {
                    propertyName: '_hidden',
                    value: false
                }
            };
        });
        yield put(actions.Changes.persistChanges(changes));
    });
}
