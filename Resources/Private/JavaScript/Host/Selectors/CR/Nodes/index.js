import {$get, $set} from 'plow-js';
import {createSelector, defaultMemoize} from 'reselect';

import {byNameSelector as nodeTypeByNameSelector} from '../NodeTypes/';

const byContextPath = state => contextPath => $get(['cr', 'nodes', 'byContextPath', contextPath], state);
const focused = $get('cr.nodes.focused.contextPath');
const hovered = $get('cr.nodes.hovered.contextPath');


export const focusedSelector = createSelector(
    [
        byContextPath,
        focused,
        nodeTypeByNameSelector
    ],
    (byContextPath, focused, nodeType) => $set('nodeType', nodeType, byContextPath(focused))
);

export const hoveredSelector = createSelector(
    [
        byContextPath,
        hovered,
        nodeTypeByNameSelector
    ],
    (byContextPath, hovered, nodeType) => $set('nodeType', nodeType, byContextPath(hovered))
);

export const byContextPathSelector = contextPath => defaultMemoize(
    createSelector(
        [
            byContextPath,
            nodeTypeByNameSelector
        ],
        (byContextPath, hovered, nodeType) => $set('nodeType', contextPath, byContextPath(hovered))
    )
);
