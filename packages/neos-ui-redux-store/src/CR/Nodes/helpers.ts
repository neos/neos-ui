import {isNode, Node, NodeMap, NodeContextPath} from '@neos-project/neos-ts-interfaces';

//
// Helper function to determine allowed node types
//
export const getAllowedNodeTypesTakingAutoCreatedIntoAccount = (baseNode: Node, parentOfBaseNode: Node, nodeTypesRegistry: any) => {
    if (!baseNode) {
        return [];
    }
    if (baseNode.isAutoCreated) {
        if (!parentOfBaseNode) {
            return [];
        }
        return nodeTypesRegistry.getAllowedGrandChildNodeTypes(
            parentOfBaseNode.nodeType,
            baseNode.name
        );
    }

    // Not auto created
    return nodeTypesRegistry.getAllowedChildNodeTypes(baseNode.nodeType);
};

//
// Helper function to check if the node is collapsed
//
export const isNodeCollapsed = (node: Node, isToggled: boolean, rootNode: Node, loadingDepth: number) => {
    const isCollapsedByDefault = loadingDepth === 0 ? false : node.depth - rootNode.depth >= loadingDepth;
    return (isCollapsedByDefault && !isToggled) || (!isCollapsedByDefault && isToggled);
};

export const getNodeOrThrow = (nodeMap: NodeMap, contextPath: NodeContextPath) => {
    const node = nodeMap[contextPath];
    if (!isNode(node)) {
        throw new Error(`Node with context path ${contextPath} is not in state`);
    }
    return node;
};
