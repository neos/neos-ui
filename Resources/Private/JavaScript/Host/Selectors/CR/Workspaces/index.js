import {$get} from 'plow-js';
import {createSelector} from 'reselect';

export const activeWorkspaceNameSelector = $get('cr.workspaces.active');
export const activeDocumentContextPathSelector = $get('ui.contentView.contextPath');

export const publishableNodesSelector = createSelector(
    [
        activeWorkspaceNameSelector,
        state => state
    ],
    (activeWorkspaceName, state) => $get(['cr', 'workspaces', 'byName', activeWorkspaceName, 'publishableNodes'], state)
);
export const publishableNodesInDocumentSelector = createSelector(
    [
        publishableNodesSelector,
        activeDocumentContextPathSelector
    ],
    (publishableNodes, activeDocumentContextPath) => publishableNodes.filter(i => i.documentContextPath === activeDocumentContextPath)
);
