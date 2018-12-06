import {Node, NodeContextPath} from '@neos-project/neos-ts-interfaces';

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
// Helper function to get parent contextPath from current contextPath
//
export const parentNodeContextPath = (contextPath: NodeContextPath) => {
    if (typeof contextPath !== 'string') {
        console.error('`contextPath` must be a string!'); // tslint:disable-line
        return null;
    }
    const [path, context] = contextPath.split('@');

    if (path.length === 0) {
        // We are at top level; so there is no parent anymore!
        return null;
    }

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

//
// Helper function to check if the node is collapsed
//
export const isNodeCollapsed = (node: Node, isToggled: boolean, rootNode: Node, loadingDepth: number) => {
    const isCollapsedByDefault = loadingDepth === 0 ? false : node.depth - rootNode.depth >= loadingDepth;
    return (isCollapsedByDefault && !isToggled) || (!isCollapsedByDefault && isToggled);
};
