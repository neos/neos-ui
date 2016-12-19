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
