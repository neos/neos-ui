import {createSelector} from 'reselect';
import {documentNodeContextPathSelector} from '../Nodes/selectors';
import {GlobalState} from '../../System';
import {NodeContextPath, WorkspaceStatus} from '@neos-project/neos-ts-interfaces';

export const personalWorkspaceNameSelector = (state: GlobalState) => state?.cr?.workspaces?.personalWorkspace?.name;

export const personalWorkspaceRebaseStatusSelector = (state: GlobalState) => state?.cr?.workspaces?.personalWorkspace?.status;

export const baseWorkspaceSelector = (state: GlobalState) => state?.cr?.workspaces?.personalWorkspace?.baseWorkspace;

export const isWorkspaceReadOnlySelector = (state: GlobalState) => {
    if (state?.cr?.workspaces?.personalWorkspace?.status === WorkspaceStatus.OUTDATED_CONFLICT) {
        return true;
    }
    return state?.cr?.workspaces?.personalWorkspace?.readOnly || false
};

export const publishableNodesSelector = (state: GlobalState) => state?.cr?.workspaces?.personalWorkspace?.publishableNodes;

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
