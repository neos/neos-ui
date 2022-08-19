import {$get} from 'plow-js';
import {GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {createSelector} from 'reselect';

import {siteNodeContextPathSelector, siteNodeSelector, nodesByContextPathSelector} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/selectors';
import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';
import {NodeContextPath, NodeMap} from '@neos-project/neos-ts-interfaces';

// contextPath for Neos >= 9.0 is a NodeAddress without hierarchy infos; so we need to traverse the "parent" links.
function rootlineForNode(contextPath: NodeContextPath, nodesByContextPath: NodeMap): string[] {
    const node = nodesByContextPath[contextPath];
    if (node && node.parent) {
        return [...rootlineForNode(node.parent, nodesByContextPath), node.identifier];
    }
    return [];
}

export const getAllFocused = (state: GlobalState) => $get(['ui', 'pageTree', 'focused'], state);
export const areFocusedNodesNestedInEachOther = createSelector(
    [
        getAllFocused,
        nodesByContextPathSelector
    ],
    (focusedNodesContextPaths, nodesByContextPath) => {
        const rootlinesOfFocusedNodes = focusedNodesContextPaths.map((contextPath: NodeContextPath) => rootlineForNode(contextPath, nodesByContextPath).join('/'));

        return !rootlinesOfFocusedNodes.every((pathA: string) => {
            return rootlinesOfFocusedNodes.every((pathB: string) => !(pathB.indexOf(pathA) === 0 && pathA !== pathB));
        });
    }
);

export const getFocused = (state: GlobalState) => {
    const focused = getAllFocused(state);
    return focused && focused[0] ? focused[0] : null;
};
export const getToggled = (state: GlobalState) => $get(['ui', 'pageTree', 'toggled'], state);
export const getLoading = (state: GlobalState) => $get(['ui', 'pageTree', 'loading'], state);
export const getErrors = (state: GlobalState) => $get(['ui', 'pageTree', 'errors'], state);
export const getHidden = (state: GlobalState) => $get(['ui', 'pageTree', 'hidden'], state);
export const getIntermediate = (state: GlobalState) => $get(['ui', 'pageTree', 'intermediate'], state);

export const destructiveOperationsAreDisabledForPageTreeSelector = createSelector(
    [
        siteNodeContextPathSelector,
        getAllFocused,
        nodesByContextPathSelector
    ],
    (siteNodeContextPath, focusedNodesContextPaths, nodesByContextPath) => {
        return [...focusedNodesContextPaths].map(contextPath => {
            const node = nodesByContextPath[contextPath];
            return node && node.isAutoCreated || siteNodeContextPath === contextPath;
        }).filter(Boolean).length > 0;
    }
);

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list && list.length)
);

export const getUncollapsed = createSelector(
    [
        (state: GlobalState) => $get(['ui', 'pageTree', 'toggled'], state),
        nodesByContextPathSelector,
        siteNodeSelector,
        (_: GlobalState, {loadingDepth = 0}: any) => loadingDepth
    ],
    (toggleTreeNodeContextPaths, nodesByContextPath, siteNode, loadingDepth) => Object.keys(nodesByContextPath || {}).filter(contextPath => {
        const node = nodesByContextPath && nodesByContextPath[contextPath];
        if (!node || !siteNode) {
            return false;
        }
        return !isNodeCollapsed(
            node,
            toggleTreeNodeContextPaths.includes(contextPath),
            siteNode,
            loadingDepth
        );
    })
);

export const selectors = {};
