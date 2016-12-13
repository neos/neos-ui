import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {selectors as nodes} from '../../CR/Nodes/index';
import {getCurrentContentCanvasContextPath} from './../ContentCanvas/selectors';

export const getFocused = $get('ui.pageTree.isFocused');
export const getUncollapsed = $get('ui.pageTree.uncollapsed');
export const getLoading = $get('ui.pageTree.loading');
export const getErrors = $get('ui.pageTree.errors');

export const getFocusedNodeContextPathSelector = createSelector(
    [
        getFocused
    ],
    focusedNodeContextPath => focusedNodeContextPath
);

export const getUncollapsedContextPaths = createSelector(
    [
        getUncollapsed
    ],
    list => list.toJS()
);

export const getIsLoading = createSelector(
    [
        getLoading
    ],
    list => Boolean(list.toJS().length)
);

//
// TODO: NODETYPE REFACTORING - Fix calls of this
//
export const getTreeNodeSelector = createSelector(
    [
        getCurrentContentCanvasContextPath,
        getFocused,
        getUncollapsed,
        getLoading,
        getErrors,
        state => state
    ],
    (
        activeNodeContextPath,
        focusedNodeContextPath,
        uncollapsedNodeContextPaths,
        loadingNodeContextPaths,
        errorNodeContextPaths,
        state
    ) => (contextPath, nodeTypeFilter = []) => {
        //
        // Try to grab the node
        //
        const node = nodes.byContextPathSelector(contextPath)(state);
        const isNodeTypeValid = nodeType => Boolean(
            nodeTypeFilter.length === 0 ||
            nodeTypeFilter.indexOf(nodeType) > -1
        );

        //
        // Check if the requested node is existent and has the correct node type
        //
        if (node && isNodeTypeValid(node.nodeType)) {
            //
            // Check for valid child nodes
            //
            const validChildren = node.children.filter(node => isNodeTypeValid(node.nodeType));
            const {contextPath, label, uri} = node;

            //
            // Turn the node into a data structure, that can be consumed by a tree view
            //
            return {
                contextPath,
                label,
                uri,
                nodeType: node.nodeType,
                isActive: contextPath === activeNodeContextPath,
                isFocused: contextPath === focusedNodeContextPath,
                isCollapsed: !uncollapsedNodeContextPaths.contains(contextPath),
                isLoading: loadingNodeContextPaths.contains(contextPath),
                hasError: errorNodeContextPaths.contains(contextPath),
                hasChildren: validChildren.length > 0,
                children: validChildren.map(node => $get('contextPath', node))
            };
        }

        return null;
    }
);
