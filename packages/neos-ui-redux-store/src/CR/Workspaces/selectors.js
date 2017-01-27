import {$get} from 'plow-js';
import {createSelector} from 'reselect';

export const activeDocumentContextPathSelector = $get('ui.contentCanvas.contextPath');

export const baseWorkspaceSelector = $get('cr.workspaces.personalWorkspace.baseWorkspace');

export const publishableNodesSelector = $get('cr.workspaces.personalWorkspace.publishableNodes');

export const publishableNodesInDocumentSelector = createSelector(
    [
        publishableNodesSelector,
        activeDocumentContextPathSelector
    ],
    (publishableNodes, activeDocumentContextPath) => publishableNodes.filter(i => $get('documentContextPath', i) === activeDocumentContextPath)
);
