import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {storedNodeByContextPath, parentNodeSelector} from '../../CR/Nodes/';
import {
    byNameSelector as nodeTypeByNameSelector,
    allowedChildNodeTypesSelector,
    allowedChildNodeTypesForAutocreatedNodeSelector,
    nodeTypeGroupsSelector
} from '../../CR/NodeTypes/';

const referenceNodeContextPathSelector = state => $get('ui.addNodeModal.referenceNode', state);

export const referenceNodeSelector = createSelector(
    [
        referenceNodeContextPathSelector,
        storedNodeByContextPath
    ],
    (referenceNodeContextPath, getNodeByContextPath) =>
        getNodeByContextPath(referenceNodeContextPath)
);

const modeSelector = state => $get('ui.addNodeModal.mode', state);

export const allowedNodeTypesSelector = createSelector(
    [
        referenceNodeSelector,
        modeSelector,
        parentNodeSelector,
        allowedChildNodeTypesSelector,
        nodeTypeByNameSelector
    ],
    (referenceNode, mode, getParentNode, getAllowedChildNodeTypes, getNodeTypeByName) => {
        if (!referenceNode || !mode) {
            return [];
        }
        const baseNode = mode === 'insert' ? referenceNode : getParentNode(referenceNode);
        if (!baseNode) {
            return [];
        }
        const allowedNodeTypes = baseNode.isAutoCreated ?
            allowedChildNodeTypesForAutocreatedNodeSelector(getParentNode(baseNode.nodeType), baseNode.name) :
            getAllowedChildNodeTypes(baseNode.nodeType);
        if (!allowedNodeTypes) {
            return [];
        }
        return allowedNodeTypes.map(nodeTypeName => {
            const nodeType = getNodeTypeByName(nodeTypeName);
            if (nodeType) {
                nodeType.name = nodeTypeName;
            }
            return nodeType;
        }).filter(i => i);
    }
);

export const groupedAllowedNodeTypesSelector = createSelector(
    [
        allowedNodeTypesSelector,
        nodeTypeGroupsSelector
    ],
    (allowedNodeTypes, nodeTypeGroups) => {
        // Distribute nodetypes into groups
        allowedNodeTypes.map(nodeType => {
            // Fallback to 'general' group
            const groupName = nodeType.ui && nodeType.ui.group ? nodeType.ui.group : 'general';
            if (groupName in nodeTypeGroups) {
                if (!nodeTypeGroups[groupName].nodeTypes) {
                    nodeTypeGroups[groupName].nodeTypes = [];
                }
                nodeTypeGroups[groupName].nodeTypes.push(nodeType);
            }
        });
        // Sort both groups and nodetypes within the group and return as array
        return Object.keys(nodeTypeGroups).map(i => {
            if (nodeTypeGroups[i].nodeTypes) {
                nodeTypeGroups[i].nodeTypes.sort((a, b) => a.ui.position > b.ui.position ? 1 : -1);
            }
            nodeTypeGroups[i].name = i;
            return nodeTypeGroups[i];
        }).filter(i => i.nodeTypes).sort((a, b) => a.position > b.position ? 1 : -1);
    }
);
