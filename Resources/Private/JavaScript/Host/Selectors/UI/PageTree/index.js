import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

const getSiteNodeContextPath = $get('cr.nodes.siteNode');
const getTreeNode = state => contextPath => $get(['ui', 'pageTree', 'nodesByContextPath', contextPath], state);
const getChildContextPaths = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state);
const getActive = $get('ui.pageTree.active');
const getFocused = $get('ui.pageTree.focused');

const recursivelyResolveChildNodes = (contextPath, getTreeNode, getChildContextPaths, active, focused) => {
    const treeNode = getTreeNode(contextPath);

    return treeNode && {
        ...treeNode,
        isActive: treeNode.contextPath === active,
        isFocused: treeNode.contextPath === focused,
        children: treeNode.isCollapsed ? [] : getChildContextPaths(contextPath).map(
            contextPath => recursivelyResolveChildNodes(contextPath, getTreeNode, getChildContextPaths, active, focused)
        ).filter(item => typeof item !== 'undefined')
    };
};

export const treeSelector = createSelector(
    [
        getSiteNodeContextPath,
        getTreeNode,
        getChildContextPaths,
        getActive,
        getFocused
    ],
    recursivelyResolveChildNodes
);
