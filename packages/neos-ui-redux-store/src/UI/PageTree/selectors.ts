import {GlobalState} from '../../System';
import {createSelector} from 'reselect';

import {siteNodeContextPathSelector, siteNodeSelector, nodesByContextPathSelector} from '../../CR/Nodes/selectors';
import {isNodeCollapsed} from '../../CR/Nodes/helpers';

export const getAllFocused = (state: GlobalState) => state?.ui?.pageTree?.focused;
export const getFocused = (state: GlobalState) => {
    const focused = getAllFocused(state);
    return focused && focused[0] ? focused[0] : null;
};
export const getToggled = (state: GlobalState) => state?.ui?.pageTree?.toggled;
export const getLoading = (state: GlobalState) => state?.ui?.pageTree?.loading;
export const getErrors = (state: GlobalState) => state?.ui?.pageTree?.errors;
export const getHidden = (state: GlobalState) => state?.ui?.pageTree?.hidden;
export const getIntermediate = (state: GlobalState) => state?.ui?.pageTree?.intermediate;

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
        (state: GlobalState) => state?.ui?.pageTree?.toggled,
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
