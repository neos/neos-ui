import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';
import {selectors as nodes} from '../../CR/Nodes/index';
import {getAllowedNodeTypesTakingAutoCreatedIntoAccount} from '../../CR/Nodes/helpers';

const referenceNodeContextPathSelector = state => $get('ui.addNodeModal.referenceNode', state);

export const referenceNodeSelector = createSelector(
    [
        referenceNodeContextPathSelector,
        state => state
    ],
    (referenceNodeContextPath, state) =>
        nodes.byContextPathSelector(referenceNodeContextPath)(state)
);

export const referenceNodeParentSelector = createSelector(
    [
        referenceNodeSelector,
        state => state
    ],
    (referenceNode, state) => {
        if (!referenceNode) {
            return undefined;
        }

        return nodes.parentNodeSelector(state)(referenceNode);
    }
);

export const referenceNodeGrandParentSelector = createSelector(
    [
        referenceNodeParentSelector,
        state => state
    ],
    (referenceNodeParent, state) => {
        if (!referenceNodeParent) {
            return undefined;
        }

        return nodes.parentNodeSelector(state)(referenceNodeParent);
    }
);

/**
 * This selector returns a function which you need to pass in the node-Type-Registry, to
 * get back an object with keys "insert", "append" and "prepend".
 */
export const getAllowedNodeTypesByModeSelector = createSelector(
    [
        referenceNodeSelector,
        referenceNodeParentSelector,
        referenceNodeGrandParentSelector
    ],
    (referenceNode, referenceNodeParent, referenceNodeGrandParent) =>
        defaultMemoize(nodeTypesRegistry => {
            if (!referenceNode) {
                return {
                    insert: [],
                    append: [],
                    prepend: []
                };
            }

            const allowedNodeTypesByMode = {};

            // INSERT
            allowedNodeTypesByMode.insert = getAllowedNodeTypesTakingAutoCreatedIntoAccount(referenceNode, referenceNodeParent, nodeTypesRegistry);

            // APPEND
            allowedNodeTypesByMode.append = getAllowedNodeTypesTakingAutoCreatedIntoAccount(referenceNodeParent, referenceNodeGrandParent, nodeTypesRegistry);

            // PREPEND == append
            allowedNodeTypesByMode.prepend = allowedNodeTypesByMode.append;

            return allowedNodeTypesByMode;
        }
    )
);
