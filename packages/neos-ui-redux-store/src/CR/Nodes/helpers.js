//
// Helper function to determine allowed node types
//
export const getAllowedNodeTypesTakingAutoCreatedIntoAccount = (baseNode, parentOfBaseNode, nodeTypesRegistry) => {
    if (!baseNode) {
        return [];
    }
    if (baseNode.isAutoCreated) {
        if (!parentOfBaseNode) {
            return [];
        }
        return nodeTypesRegistry.getAllowedGrandChildNodeTypes(parentOfBaseNode.nodeType, baseNode.name);
    }

    // not auto created
    return nodeTypesRegistry.getAllowedChildNodeTypes(baseNode.nodeType);
};
