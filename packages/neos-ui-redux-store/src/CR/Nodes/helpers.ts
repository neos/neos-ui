import {isNode, Node, NodeMap, NodeContextPath, SelectionModeTypes} from '@neos-project/neos-ts-interfaces';

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
// IMPORTANT: The function is used just by the old CR and the can be removed,
// when the event sourced CR is the only way
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

export const getNodeOrThrow = (nodeMap: NodeMap, contextPath: NodeContextPath) => {
    const node = nodeMap[contextPath];
    if (!isNode(node)) {
        throw new Error(`Node with context path ${contextPath} is not in state`);
    }
    return node;
};

export const calculateNewFocusedNodes = (selectionMode: SelectionModeTypes, contextPath: NodeContextPath, focusedNodesContextPaths: NodeContextPath[], nodesByContextPath: NodeMap): NodeContextPath[] | null => {
    if (selectionMode === SelectionModeTypes.SINGLE_SELECT) {
        return [contextPath];
    } else if (selectionMode === SelectionModeTypes.RANGE_SELECT) {
        const lastSelectedNodeContextPath = focusedNodesContextPaths[focusedNodesContextPaths.length - 1];
        const lastSelectedNode = nodesByContextPath[lastSelectedNodeContextPath];
        if (lastSelectedNode && lastSelectedNode.parent) {
            const parentNode = getNodeOrThrow(nodesByContextPath, lastSelectedNode.parent);
            const tempSelection: string[] = [];
            let startSelectionFlag = false;
            // if both start and end nodes are within children, then we can do range select
            const startAndEndOfSelectionAreOnOneLevel = parentNode.children.some(child => {
                if (child.contextPath === lastSelectedNodeContextPath || child.contextPath === contextPath) {
                    if (startSelectionFlag) { // if matches for the second time it means that both start and end of selection were found
                        tempSelection.push(child.contextPath); // also push the last node
                        return true;
                    } else {
                        startSelectionFlag = true;
                    }
                }
                if (startSelectionFlag) {
                    tempSelection.push(child.contextPath);
                }
                return false;
            });
            if (startAndEndOfSelectionAreOnOneLevel) {
                const focusedNodesContextPathsSet = new Set(focusedNodesContextPaths);
                tempSelection.forEach(contextPath => focusedNodesContextPathsSet.add(contextPath));
                return [...focusedNodesContextPathsSet] as string[];
            }
        }
    } else {
        const focusedNodesContextPathsSet = new Set(focusedNodesContextPaths);
        if (focusedNodesContextPathsSet.has(contextPath)) {
            focusedNodesContextPathsSet.delete(contextPath);
        } else {
            focusedNodesContextPathsSet.add(contextPath);
        }
        return [...focusedNodesContextPathsSet];
    }
    return null;
};
