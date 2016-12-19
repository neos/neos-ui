import {$get} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';
import {selectors as nodes} from '../../CR/Nodes/index';
import {getAllowedNodeTypesTakingAutoCreatedIntoAccount} from '../../CR/Nodes/helpers';

const referenceNodeContextPathSelector = state => $get('ui.addNodeModal.contextPath', state);

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
 * get back an object with keys "into", "after" and "before".
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
                    into: [],
                    after: [],
                    before: []
                };
            }

            const allowedNodeTypesByMode = {};

            // INTO
            allowedNodeTypesByMode.into = getAllowedNodeTypesTakingAutoCreatedIntoAccount(
                referenceNode,
                referenceNodeParent,
                nodeTypesRegistry
            );

            // AFTER
            allowedNodeTypesByMode.after = getAllowedNodeTypesTakingAutoCreatedIntoAccount(
                referenceNodeParent,
                referenceNodeGrandParent,
                nodeTypesRegistry
            );

            // BEFORE == after
            allowedNodeTypesByMode.before = allowedNodeTypesByMode.after;

            return allowedNodeTypesByMode;
        }
    )
);
