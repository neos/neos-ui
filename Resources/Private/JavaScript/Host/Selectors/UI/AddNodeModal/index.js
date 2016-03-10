import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {storedNodeByContextPath, parentNodeSelector} from '../../CR/Nodes/';
import {byNameSelector as nodeTypeByNameSelector, allowedChildNodeTypesSelector, allowedChildNodeTypesForAutocreatedNodeSelector} from '../../CR/NodeTypes/';

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
