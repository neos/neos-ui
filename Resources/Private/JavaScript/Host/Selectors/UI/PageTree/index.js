import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

const getSiteNodeContextPath = $get('cr.nodes.siteNode');
const getTreeNode = state => contextPath => $get(['ui', 'pageTree', 'nodesByContextPath', contextPath], state);
const getChildren = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath, 'children'], state);
const getActive = $get('ui.pageTree.active');
const getFocused = $get('ui.pageTree.focused');

const recursivelyResolveChildNodes = (contextPath, getTreeNode, getChildren, active, focused) => {
    const treeNode = getTreeNode(contextPath);

    return treeNode && {
        ...treeNode,
        isActive: treeNode.contextPath === active,
        isFocused: treeNode.contextPath === focused,
        children: treeNode.isCollapsed ? [] : getChildren(contextPath).map(
            childEnvelope => recursivelyResolveChildNodes(childEnvelope.contextPath, getTreeNode, getChildren, active, focused)
        ).filter(item => typeof item !== 'undefined')
    };
};

export const treeSelector = createSelector(
    [
        getSiteNodeContextPath,
        getTreeNode,
        getChildren,
        getActive,
        getFocused
    ],
    recursivelyResolveChildNodes
);
