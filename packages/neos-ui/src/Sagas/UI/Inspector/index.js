import {take, race, put, call, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';

const getFocusedNode = selectors.CR.Nodes.focusedSelector;
const getTransientInspectorValues = state => {
    const values = $get(['ui', 'inspector', 'valuesByNodePath'], state);

    return values.toJS ? values.toJS() : values;
};

function * inspectorSaga({globalRegistry}) {
    yield take(actionTypes.System.READY);

    const inspectorRegistry = globalRegistry.get('inspector');

    while (true) { // eslint-disable-line no-constant-condition
        //
        // Wait for the user to focus another node, to discard all transient
        // changes or to apply his/her changes,
        //
        while (true) { // eslint-disable-line no-constant-condition
            const waitForNextAction = yield race([
                take(actionTypes.CR.Nodes.FOCUS),
                take(actionTypes.UI.Inspector.DISCARD),
                take(actionTypes.UI.Inspector.APPLY)
            ]);
            const nextAction = Object.keys(waitForNextAction).map(k => waitForNextAction[k])[0];

            //
            // If the user focused a different node, just continue
            //
            if (nextAction.type === actionTypes.CR.Nodes.FOCUS) {
                break;
            }

            //
            // If the user discarded his/her changes, just continue
            //
            if (nextAction.type === actionTypes.UI.Inspector.DISCARD) {
                break;
            }

            //
            // If the user wants to apply his/her changes, let's start that process
            //
            if (nextAction.type === actionTypes.UI.Inspector.APPLY) {
                try {
                    //
                    // Persist the inspector changes
                    //
                    yield call(flushInspector, inspectorRegistry);
                    yield put(actions.UI.Inspector.clear());
                } catch (err) {
                    //
                    // An error occured, we should not leave the loop until
                    // the user does something about it
                    //
                    console.error(err);
                    continue;
                }

                break;
            }
        }
    }
}

function * flushInspector(inspectorRegistry) {
    const state = yield select();
    const focusedNode = getFocusedNode(state);
    const transientInspectorValues = getTransientInspectorValues(state);
    const transientInspectorValuesForFocusedNodes = transientInspectorValues[focusedNode.contextPath];

    for (const propertyName of Object.keys(transientInspectorValuesForFocusedNodes)) {
        const transientValue = transientInspectorValuesForFocusedNodes[propertyName];

        //
        // Try to run all hooks on the transient value
        const initialValue = Promise.resolve(transientValue.value);
        const value = yield transientValue.hooks ?
            Object.keys(transientValue.hooks).reduce(
                (valueAsPromise, hookIdentifier) => {
                    const hookFn = inspectorRegistry.get('saveHooks').get(hookIdentifier);

                    return valueAsPromise.then(value => {
                        try {
                            return hookFn(value, transientValue.hooks[hookIdentifier]);
                        } catch (e) {
                            console.error(`There was an error executing ${hookIdentifier}`, e);
                            throw e;
                        }
                    });
                },
                initialValue
            ) : initialValue;

        //
        // Build a property change object
        //
        const change = {
            type: 'Neos.Neos.Ui:Property',
            subject: focusedNode.contextPath,
            payload: {propertyName, value}
        };

        //
        // Then persist the final value
        //
        yield put(actions.Changes.persistChange(change));
    }

    //
    // TODO: Handle reloadIfChanged
    // TODO: Handle reloadPageIfChanged
    //
}

export const sagas = [
    inspectorSaga
];
