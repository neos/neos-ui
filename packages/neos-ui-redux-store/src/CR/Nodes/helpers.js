import {$get} from 'plow-js';

//
// Helper function to determine allowed node types
//
export const getAllowedNodeTypesTakingAutoCreatedIntoAccount = (baseNode, parentOfBaseNode, nodeTypesRegistry) => {
    if (!baseNode) {
        return [];
    }
    if ($get('isAutoCreated', baseNode)) {
        if (!parentOfBaseNode) {
            return [];
        }
        return nodeTypesRegistry.getAllowedGrandChildNodeTypes(
            $get('nodeType', parentOfBaseNode),
            $get('name', baseNode)
        );
    }

    // not auto created
    return nodeTypesRegistry.getAllowedChildNodeTypes($get('nodeType', baseNode));
};

//
// Helper function to get parent contextPath from current contextPath
//
export const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }

    const [path, context] = contextPath.split('@');

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

//
// Helper function to check if the node is collapsed
//
export const isNodeCollapsed = (node, isToggled, rootNode, loadingDepth) => {
    const isCollapsedByDefault = loadingDepth === 0 ? false : $get('depth', node) - $get('depth', rootNode) >= loadingDepth;
    return (isCollapsedByDefault && !isToggled) || (!isCollapsedByDefault && isToggled);
};
