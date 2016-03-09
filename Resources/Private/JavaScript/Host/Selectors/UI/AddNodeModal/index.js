import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {storedNodeByContextPath, parentNodeSelector} from '../../CR/Nodes/';
import {byNameSelector as nodeTypeByNameSelector, allowedChildNodeTypesSelector} from '../../CR/NodeTypes/';

const referenceNodeContextPathSelector = state => $get('ui.addNodeModal.referenceNode', state);

const referenceNodeSelector = createSelector(
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
            return null;
        }
        const allowedNodeTypes = mode === 'insert' ? getAllowedChildNodeTypes(referenceNode.nodeType) : getParentNode(referenceNode) && getAllowedChildNodeTypes(getParentNode(referenceNode).nodeType);
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
