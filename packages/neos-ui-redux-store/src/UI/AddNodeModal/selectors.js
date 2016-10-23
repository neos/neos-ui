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
// 
// const modeSelector = state => $get('ui.addNodeModal.mode', state);
//
// export const nodeTypesForAddNodeModalSelector = createSelector(
//     [
//         referenceNodeSelector,
//         modeSelector,
//         groupedAllowedNodeTypesSelector
//     ],
//     (referenceNode, mode, getGroupedAllowedNodeTypes) =>
//         referenceNode && mode && getGroupedAllowedNodeTypes(referenceNode, mode)
// );
