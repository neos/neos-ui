import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {parentNodeSelector} from '../Nodes';
import {byNameSelector} from '../NodeTypes';

const nodeTypeGroupsSelector = $get('cr.nodeTypes.groups');

const allowedChildNodeTypesSelector = state => nodeTypeName => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes) : [];
};

const allowedChildNodeTypesForAutocreatedNodeSelector = state => (nodeTypeName, autoCreatedNodeName) => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'childNodes', autoCreatedNodeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes) : [];
};

export const allowedNodeTypesSelector = createSelector(
    [
        parentNodeSelector,
        allowedChildNodeTypesSelector,
        byNameSelector
    ],
    (getParentNode, getAllowedChildNodeTypes, getNodeTypeByName) =>
        (referenceNode, mode) => {
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
        nodeTypeGroupsSelector,
        allowedNodeTypesSelector
    ],
    (nodeTypeGroups, getAllowedNodeTypes) =>
        (referenceNode, mode) => {
            // Distribute nodetypes into groups
            const groups = getAllowedNodeTypes(referenceNode, mode).reduce((groups, nodeType) => {
                // Fallback to 'general' group
                const groupName = nodeType.ui && nodeType.ui.group ? nodeType.ui.group : 'general';
                if (groupName in nodeTypeGroups) {
                    const group = groups[groupName] || Object.assign({}, nodeTypeGroups[groupName]);

                    if (!group.nodeTypes) {
                        group.nodeTypes = [];
                    }
                    group.nodeTypes.push(nodeType);
                    groups[groupName] = group;
                }

                return groups;
            }, {});
            // Sort both groups and nodetypes within the group and return as array
            return Object.keys(groups).map(i => {
                if (groups[i].nodeTypes) {
                    groups[i].nodeTypes.sort((a, b) => a.ui.position > b.ui.position ? 1 : -1);
                }
                groups[i].name = i;
                return groups[i];
            }).filter(i => i.nodeTypes).sort((a, b) => a.position > b.position ? 1 : -1);
        }
);
