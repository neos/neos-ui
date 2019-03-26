import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {documentNodeContextPathSelector} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/selectors';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {NodeContextPath} from '@neos-project/neos-ts-interfaces';



export const personalWorkspaceNameSelector = (state: GlobalState) => $get(['cr', 'workspaces', 'personalWorkspace', 'name'], state);

export const baseWorkspaceSelector = (state: GlobalState) => $get(['cr', 'workspaces', 'personalWorkspace', 'baseWorkspace'], state);

export const isWorkspaceReadOnlySelector = (state: GlobalState) => $get(['cr', 'workspaces', 'personalWorkspace', 'readOnly'], state) || false;

export const publishableNodesSelector = (state: GlobalState) => $get(['cr', 'workspaces', 'personalWorkspace', 'publishableNodes'], state);

export const publishableNodesInDocumentSelector = createSelector(
    [
        publishableNodesSelector,
        documentNodeContextPathSelector
    ],
    (publishableNodes, activeDocumentContextPath) => publishableNodes.filter(i => i.documentContextPath === activeDocumentContextPath)
);

export const makeIsDocumentNodeDirtySelector = () => createSelector(
    [
        publishableNodesSelector,
        (_: GlobalState, documentContextPath: NodeContextPath) => documentContextPath
    ],
    (publishableNodes, documentContextPath) => publishableNodes.filter(i => (
        i.documentContextPath === documentContextPath ||
        i.contextPath === documentContextPath
    )).length > 0
);

export const makeIsContentNodeDirtySelector = () => createSelector(
    [
        publishableNodesSelector,
        (_: GlobalState, contextPath: NodeContextPath) => contextPath
    ],
    (publishableNodes, contextPath) => publishableNodes.filter(i => i.contextPath === contextPath).length > 0
);
