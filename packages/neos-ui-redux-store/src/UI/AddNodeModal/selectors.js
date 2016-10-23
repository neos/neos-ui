import {$get} from 'plow-js';
import {createSelector} from 'reselect';
import {selectors as nodes} from '../../CR/Nodes/index';

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
