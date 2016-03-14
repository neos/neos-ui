import {$get, $transform} from 'plow-js';

import {expose} from 'Host/Plugins/UI/index';
import {CR} from 'Host/Selectors/index';

export const focusedNode = () => expose(
    'nodes.focused',
    $transform({
        node: CR.Nodes.focusedSelector,
        typoscriptPath: $get('cr.nodes.focused.typoscriptPath')
    })
);

export const hoveredNode = () => expose(
    'nodes.hovered',
    $transform({
        node: CR.Nodes.hoveredSelector,
        typoscriptPath: $get('cr.nodes.hovered.typoscriptPath')
    })
);

export const byContextPath = () => expose(
    'nodes.byContextPath',
    (state, contextPath) => CR.Nodes.byContextPathSelector(contextPath)(state)
);
