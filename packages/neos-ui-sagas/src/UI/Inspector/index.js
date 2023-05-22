import {take, race, put, call, select} from 'redux-saga/effects';
import {$get} from 'plow-js';
import escapeRegExp from 'lodash.escaperegexp';
import {findNodeInGuestFrame} from '@neos-project/neos-ui-guest-frame/src/dom';

import {actionTypes, actions, selectors} from '@neos-project/neos-ui-redux-store';

import backend from '@neos-project/neos-ui-backend-connector';

import {applySaveHooksForTransientValue} from '../../Changes/saveHooks';

const getFocusedNode = selectors.CR.Nodes.focusedSelector;
const getTransientInspectorValues = state => {
    const values = $get(['ui', 'inspector', 'valuesByNodePath'], state);

    return values;
};

export function * inspectorSaga({globalRegistry}) {
    yield take(actionTypes.System.READY);

    const inspectorRegistry = globalRegistry.get('inspector');

    while (true) { // eslint-disable-line no-constant-condition
        //
        // Wait for the user to focus another node, to switch to another page,
        // to discard all transient changes or to apply his/her changes,
        //
        while (true) { // eslint-disable-line no-constant-condition
            const waitForNextAction = yield race([
                take(actionTypes.CR.Nodes.FOCUS),
                take(actionTypes.UI.ContentCanvas.SET_SRC),
                take(actionTypes.UI.Inspector.ELEMENT_WAS_SELECTED),
                take(actionTypes.UI.Inspector.DISCARD),
                take(actionTypes.UI.Inspector.APPLY)
            ]);
            const nextAction = Object.keys(waitForNextAction).map(k => waitForNextAction[k])[0];

            //
            // If the user focused a different node, close the secondary inspector and continue
            //
            if (nextAction.type === actionTypes.CR.Nodes.FOCUS) {
                yield put(actions.UI.Inspector.closeSecondaryInspector());

                const focusedNode = yield select(getFocusedNode);
                if (!$get('isFullyLoaded', focusedNode)) {
                    const {q} = backend.get();
                    const [fullyLoadedFocusedNode] = yield q(focusedNode).get();

                    if (fullyLoadedFocusedNode) {
                        yield put(actions.CR.Nodes.merge({
                            [fullyLoadedFocusedNode.contextPath]: fullyLoadedFocusedNode
                        }));
                    }
                }
                break;
            }

            //
            // If the user switched to a different page, close the secondary inspector and continue
            //
            if (nextAction.type === actionTypes.UI.ContentCanvas.SET_SRC) {
                yield put(actions.UI.Inspector.closeSecondaryInspector());
                break;
            }

            //
            // If the user used the <SelectedElement/> Dropdown, show the
            // UnappliedChangesDialog and react accordingly
            //
            if (nextAction.type === actionTypes.UI.Inspector.ELEMENT_WAS_SELECTED) {
                yield put(actions.UI.Inspector.escape());
                const [escapeAction] = Object.values(
                    yield race([
                        take(actionTypes.UI.Inspector.RESUME),
                        take(actionTypes.UI.Inspector.APPLY),
                        take(actionTypes.UI.Inspector.DISCARD)
                    ])
                );

                if (escapeAction.type === actionTypes.UI.Inspector.RESUME) {
                    // The user has decided to continue editing properties in the inspector
                    break;
                }

                if (escapeAction.type === actionTypes.UI.Inspector.APPLY) {
                    try {
                        yield * applyInspectorChanges(inspectorRegistry);
                    } catch (err) {
                        //
                        // An error occured, we should not leave the loop until
                        // the user does something about it
                        //
                        console.error(err);
                        continue;
                    }
                }

                yield put(actions.CR.Nodes.focus(nextAction.payload.selectedElementContextPath));

                if (escapeAction.type === actionTypes.UI.Inspector.DISCARD) {
                    break;
                }
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
                    yield * applyInspectorChanges(inspectorRegistry);
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

function * applyInspectorChanges(inspectorRegistry) {
    yield call(flushInspector, inspectorRegistry);
    const focusedNodeContextPath = yield select(selectors.CR.Nodes.focusedNodePathSelector);
    yield put(actions.UI.Inspector.clear(focusedNodeContextPath));
}

function * flushInspector(inspectorRegistry) {
    const state = yield select();
    const focusedNode = getFocusedNode(state);
    let focusedNodeFusionPath = $get('cr.nodes.focused.fusionPath', state);
    if (!focusedNodeFusionPath) {
        const focusedDomNode = findNodeInGuestFrame($get('contextPath', focusedNode));
        focusedNodeFusionPath = focusedDomNode && focusedDomNode.getAttribute('data-__neos-fusion-path');
    }
    const transientInspectorValues = getTransientInspectorValues(state);
    const transientInspectorValuesForFocusedNodes = $get([$get('contextPath', focusedNode)], transientInspectorValues);

    //
    // Accumulate changes to be persisted
    //
    const saveHooksRegistry = inspectorRegistry.get('saveHooks');
    const changes = [];

    for (const propertyName of Object.keys(transientInspectorValuesForFocusedNodes)) {
        const transientValue = transientInspectorValuesForFocusedNodes[propertyName];

        //
        // Try to run all hooks on the transient value
        const value = yield * applySaveHooksForTransientValue(transientValue, saveHooksRegistry);

        //
        // Build a property change object
        //
        const change = {
            type: 'Neos.Neos.Ui:Property',
            subject: $get('contextPath', focusedNode),
            payload: {
                propertyName,
                value,
                nodeDomAddress: {
                    contextPath: $get('contextPath', focusedNode),
                    fusionPath: focusedNodeFusionPath
                }
            }
        };

        //
        // Add to changes to be persisted
        //
        changes.push(change);

        //
        // Update uris of all nodes in state if uriPathSegment has been changed
        //
        if (propertyName === 'uriPathSegment') {
            const oldValue = $get('properties.uriPathSegment', focusedNode);
            const newValue = transientValue.value;
            if (oldValue !== newValue) {
                const oldUri = $get('uri', focusedNode);
                const oldUriFragment = oldUri.split('@')[0];
                const newUriFragment = oldUriFragment.replace(new RegExp(escapeRegExp(oldValue) + '$'), newValue);
                yield put(actions.CR.Nodes.updateUri(oldUriFragment, newUriFragment));
            }
        }
    }
    yield put(actions.Changes.persistChanges(changes));

    //
    // TODO: Handle reloadIfChanged
    // TODO: Handle reloadPageIfChanged
    //
}
