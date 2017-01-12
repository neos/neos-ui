import {$get} from 'plow-js';
import {createSelector} from 'reselect';

export const activeDocumentContextPathSelector = $get('ui.contentCanvas.contextPath');

export const baseWorkspaceSelector = createSelector(
    [
        state => state
    ],
    state => $get('cr.workspaces.personalWorkspace.baseWorkspace', state)
);
export const publishableNodesSelector = createSelector(
    [
        state => state
    ],
    state => $get('cr.workspaces.personalWorkspace.publishableNodes', state)
);
export const publishableNodesInDocumentSelector = createSelector(
    [
        publishableNodesSelector,
        activeDocumentContextPathSelector
    ],
    (publishableNodes, activeDocumentContextPath) => publishableNodes.filter(i => $get('documentContextPath', i) === activeDocumentContextPath)
);
