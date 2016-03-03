import {expose} from 'Host/Plugins/UI/';
import {$get} from 'plow-js';

export const focusedNode = () => expose(
    'nodes.focused',
    state => ({
        node: $get(
            ['cr', 'nodes', 'byContextPath', $get('cr.nodes.focused.contextPath', state)],
            state
        ),
        typoscriptPath: $get('cr.nodes.focused.typoscriptPath', state)
    })
);

export const hoveredNode = () => expose(
    'nodes.hovered',
    state => ({
        node: $get(
            ['cr', 'nodes', 'byContextPath', $get('cr.nodes.hovered.contextPath', state)],
            state
        ),
        typoscriptPath: $get('cr.nodes.hovered.typoscriptPath', state)
    })
);

export const byContextPath = () => expose(
    'nodes.byContextPath',
    (state, contextPath) => {
        const node = $get(
            ['cr', 'nodes', 'byContextPath', contextPath],
            state
        );

        if (node) {
            return {
                ...node,
                nodeType: $get(
                    ['cr', 'nodeTypes', 'byName', node.nodeType],
                    state
                )
            };
        }
    }
);

export const logToConsole = () => expose(
    'log.to.console',
    state => console.log({
        node: $get(
            ['cr', 'nodes', 'byContextPath', $get('cr.nodes.hovered.contextPath', state)],
            state
        ),
        typoscriptPath: $get('cr.nodes.hovered.typoscriptPath', state)
    })
);
