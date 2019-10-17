import {takeLatest, put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {markNodeAsHidden} from '@neos-project/neos-ui-guest-frame/src/dom';

export default function * hideNode() {
    yield takeLatest(actionTypes.CR.Nodes.HIDE, function * performPropertyChange(action) {
        const contextPath = action.payload;

        markNodeAsHidden(contextPath);

        yield put(actions.Changes.persistChanges([{
            type: 'Neos.Neos.Ui:Property',
            subject: contextPath,
            payload: {
                propertyName: '_hidden',
                value: true
            }
        }]));
    });
    yield takeLatest(actionTypes.CR.Nodes.HIDE_MULTIPLE, function * performPropertyChange(action) {
        const contextPaths = action.payload;
        const changes = [...contextPaths].map(contextPath => {
            markNodeAsHidden(contextPath);
            return {
                type: 'Neos.Neos.Ui:Property',
                subject: contextPath,
                payload: {
                    propertyName: '_hidden',
                    value: true
                }
            };
        });
        yield put(actions.Changes.persistChanges(changes));
    });
}
