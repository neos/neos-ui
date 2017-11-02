import {takeLatest} from 'redux-saga';
import {take, put, race, call} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import {calculateChangeTypeFromMode, calculateDomAddressesFromMode} from './helpers';

const STEP_SELECT_NODETYPE = Symbol('STEP_SELECT_NODETYPE');
const STEP_NODE_CREATION_DIALOG = Symbol('STEP_NODE_CREATION_DIALOG');
const STEP_FINISH = Symbol('STEP_FINISH');

export default function * addNode({globalRegistry}) {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    yield * takeLatest(actionTypes.CR.Nodes.COMMENCE_CREATION, function * (action) {
        const {referenceNodeContextPath, referenceNodeFusionPath} = action.payload;

        yield call(function * nodeCreationWorkflow(step = STEP_SELECT_NODETYPE, workflowData = {}) {
            switch (step) {
                //
                // Start with showing a dialog for node type selection
                //
                case STEP_SELECT_NODETYPE: {
                    yield put(actions.UI.SelectNodeTypeModal.open(referenceNodeContextPath));

                    const waitForNextAction = yield race([
                        take(actionTypes.UI.SelectNodeTypeModal.CANCEL),
                        take(actionTypes.UI.SelectNodeTypeModal.APPLY)
                    ]);
                    const nextAction = Object.values(waitForNextAction)[0];

                    //
                    // User closed the modal, do nothing...
                    //
                    if (nextAction.type === actionTypes.UI.SelectNodeTypeModal.CANCEL) {
                        return;
                    }

                    //
                    // User selected a node type, move on
                    //
                    if (nextAction.type === actionTypes.UI.SelectNodeTypeModal.APPLY) {
                        const {mode, nodeType} = nextAction.payload;
                        return yield call(nodeCreationWorkflow, STEP_NODE_CREATION_DIALOG, {mode, nodeType});
                    }
                    break;
                }

                case STEP_NODE_CREATION_DIALOG: {
                    const nodeType = nodeTypesRegistry.get(workflowData.nodeType);
                    const label = $get('label', nodeType);
                    const configuration = $get('ui.creationDialog', nodeType);

                    if (configuration) {
                        //
                        // This node type has a creationDialog configuration,
                        // therefore we show the creation dialog
                        //
                        yield put(actions.UI.NodeCreationDialog.open(label, configuration));

                        const waitForNextAction = yield race([
                            take(actionTypes.UI.NodeCreationDialog.CANCEL),
                            take(actionTypes.UI.NodeCreationDialog.BACK),
                            take(actionTypes.UI.NodeCreationDialog.APPLY)
                        ]);
                        const nextAction = Object.values(waitForNextAction)[0];

                        //
                        // User closed the creation dialog, do nothing...
                        //
                        if (nextAction.type === actionTypes.UI.NodeCreationDialog.CANCEL) {
                            return;
                        }

                        //
                        // User asked to go back
                        //
                        if (nextAction.type === actionTypes.UI.NodeCreationDialog.BACK) {
                            return yield call(nodeCreationWorkflow, STEP_SELECT_NODETYPE);
                        }

                        if (nextAction.type === actionTypes.UI.NodeCreationDialog.APPLY) {
                            return yield call(nodeCreationWorkflow, STEP_FINISH, {
                                ...workflowData,
                                data: nextAction.payload
                            });
                        }
                    }

                    return yield call(nodeCreationWorkflow, STEP_FINISH, workflowData);
                }

                case STEP_FINISH: {
                    const {mode, nodeType, data} = workflowData;

                    if (nodeTypesRegistry.hasRole(nodeType, 'document')) {
                        yield put(actions.UI.ContentCanvas.startLoading());
                    }

                    return yield put(actions.Changes.persistChanges([{
                        type: calculateChangeTypeFromMode(mode, 'Create'),
                        subject: referenceNodeContextPath,
                        payload: {
                            ...calculateDomAddressesFromMode(mode, referenceNodeContextPath, referenceNodeFusionPath),
                            nodeType,
                            data
                        }
                    }]));
                }

                default: return;
            }
        });
    });
}
