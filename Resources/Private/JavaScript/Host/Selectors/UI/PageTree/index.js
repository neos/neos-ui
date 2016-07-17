import {$get} from 'plow-js';
import {createSelector} from 'reselect';

import {byContextPathSelector} from '../../CR/Nodes/index';
import {isOfTypeSelector} from '../../CR/NodeTypes/index';

const getActive = $get('ui.contentCanvas.contextPath');
const getFocused = $get('ui.pageTree.focused');
const getUncollapsed = $get('ui.pageTree.uncollapsed');
const getLoading = $get('ui.pageTree.loading');
const getErrors = $get('ui.pageTree.errors');

export const getTreeNodeSelector = createSelector(
    [
        getActive,
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
    ) => (contextPath, nodeTypeFilter = '') => {
        //
        // Try to grab the node
        //
        const node = byContextPathSelector(contextPath)(state);

        //
        // Check if the requested node is existent and has the correct node type
        //
        if (node && (!nodeTypeFilter || isOfTypeSelector(nodeTypeFilter)(node.nodeType.name)(state))) {
            //
            // Check for valid child nodes
            //
            const validChildren = $get('children', node).filter(({nodeType}) =>
                !nodeTypeFilter || isOfTypeSelector(nodeTypeFilter)(nodeType)(state)
            );

            const contextPath = $get('contextPath', node);
            //
            // Turn the node into a data structure, that can be consumed by a tree view
            //
            return {
                contextPath,
                label: $get('label', node),
                uri: $get('uri', node),
                icon: $get('nodeType.ui.icon', node),
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
