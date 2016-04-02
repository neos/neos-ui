import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {parentNodeSelector} from '../Nodes';
import {byNameSelector} from '../NodeTypes';

const nodeTypeGroupsSelector = $get('cr.nodeTypes.groups');

export const allowedChildNodeTypesSelector = state => nodeTypeName => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes.toJS()) : [];
};

export const allowedChildNodeTypesForAutocreatedNodeSelector = state => (nodeTypeName, autoCreatedNodeName) => {
    const nodeTypes = $get(['cr', 'nodeTypes', 'constraints', nodeTypeName, 'childNodes', autoCreatedNodeName, 'nodeTypes'], state);
    return nodeTypes ? Object.keys(nodeTypes.toJS()) : [];
};

export const allowedNodeTypesSelector = createSelector(
    [
        parentNodeSelector,
        allowedChildNodeTypesSelector,
        byNameSelector
    ],
    (getParentNode, getAllowedChildNodeTypes, getNodeTypeByName) =>
        (referenceNode, mode) => {
            if (!referenceNode) {
                throw new Error('Reference node not defined');
            }

            if (!referenceNode.nodeType) {
                throw new Error('Reference node does not have the nodetype set');
            }
            if (['insert', 'append', 'prepend'].indexOf(mode) === -1) {
                throw new Error(`allowedNodeTypesSelector expects "mode" to be one of "insert", "append", "prepend", but "${mode}" given`);
            }
            const baseNode = mode === 'insert' ? referenceNode : getParentNode(referenceNode);
            if (!baseNode.nodeType) {
                throw new Error('Base node does not have the nodetype set');
            }
            const allowedNodeTypes = baseNode.isAutoCreated ?
                allowedChildNodeTypesForAutocreatedNodeSelector(getParentNode(baseNode.nodeType.name), baseNode.name) :
                getAllowedChildNodeTypes(baseNode.nodeType.name);

            if (!allowedNodeTypes) {
                return [];
            }

            return allowedNodeTypes.map(nodeTypeName => {
                const nodeType = getNodeTypeByName(nodeTypeName);
                return nodeType && {
                    ...nodeType.toJS(),
                    name: nodeTypeName
                };
            }).filter(i => i);
        }
);

export const groupedAllowedNodeTypesSelector = createSelector(
    [
        nodeTypeGroupsSelector,
        allowedNodeTypesSelector
    ],
    (immutableNodeTypeGroups, getAllowedNodeTypes) => {
        const nodeTypeGroups = immutableNodeTypeGroups.toJS();

        return (referenceNode, mode) => {
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
        };
    }
);
