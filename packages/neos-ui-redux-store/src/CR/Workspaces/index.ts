import produce from 'immer';
import assignIn from 'lodash.assignin';
import {action as createAction, ActionType} from 'typesafe-actions';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';

import {WorkspaceName} from '@neos-project/neos-ts-interfaces';

import {actionTypes as system, InitAction} from '../../System';
import {actionTypes as publishing, FinishAction} from '../Publishing';

import * as selectors from './selectors';

export enum TypeOfChange {
    NODE_HAS_BEEN_CREATED = 0b0001,
    NODE_HAS_BEEN_CHANGED = 0b0010,
    NODE_HAS_BEEN_MOVED = 0b0100,
    NODE_HAS_BEEN_DELETED = 0b1000
}

export interface PublishableNode {
    contextPath: NodeContextPath;
    documentContextPath: NodeContextPath;
    typeOfChange: TypeOfChange;
}

export interface WorkspaceInformation {
    name: WorkspaceName;
    publishableNodes: Array<PublishableNode>;
    baseWorkspace: WorkspaceName;
    readOnly?: boolean;
    status?: string;
}

export interface State extends Readonly<{
    personalWorkspace: WorkspaceInformation;
}> {}

export const defaultState: State = {
    personalWorkspace: {
        name: '',
        publishableNodes: [],
        baseWorkspace: '',
        status: ''
    }
};

export enum actionTypes {
    UPDATE = '@neos/neos-ui/CR/Workspaces/UPDATE',
    CHANGE_BASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/CHANGE_BASE_WORKSPACE',
    REBASE_WORKSPACE = '@neos/neos-ui/CR/Workspaces/REBASE_WORKSPACE'
}

export type Action = ActionType<typeof actions>;

/**
 * Updates the data of a workspace
 */
const update = (data: WorkspaceInformation) => createAction(actionTypes.UPDATE, data);

/**
 * Change base workspace
 */
const changeBaseWorkspace = (name: string) => createAction(actionTypes.CHANGE_BASE_WORKSPACE, name);

/**
 * Rebase the user workspace
 */
const rebaseWorkspace = (name: string) => createAction(actionTypes.REBASE_WORKSPACE, name);

//
// Export the actions
//
export const actions = {
    update,
    changeBaseWorkspace,
    rebaseWorkspace
};

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | FinishAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.personalWorkspace = action.payload.cr.workspaces.personalWorkspace;
            break;
        }
        case actionTypes.UPDATE: {
            draft.personalWorkspace = assignIn(draft.personalWorkspace, action.payload);
            break;
        }
        case publishing.FINISHED: {
            draft.personalWorkspace.publishableNodes =
                state.personalWorkspace.publishableNodes.filter(
                    (publishableNode) => !action.payload.affectedNodes.some(
                        (affectedNode) => affectedNode.contextPath === publishableNode.contextPath
                    )
                );
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
