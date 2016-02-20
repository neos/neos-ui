import {expose} from 'Host/Plugins/UI/';

export const focusedNode = () => expose(
    'nodes.focused',
    state => (state.transient && state.transient.nodes ? {
        node: state.transient.nodes.get('byContextPath').get(
            state.transient.nodes.get('focused').get('contextPath')
        ),
        typoscriptPath: state.transient.nodes.get('focused').get('typoscriptPath')
    } : {})
);

export const hoveredNode = () => expose(
    'nodes.hovered',
    state => (state.transient && state.transient.nodes ? {
        node: state.transient.nodes.get('byContextPath').get(
            state.transient.nodes.get('hovered').get('contextPath')
        ),
        typoscriptPath: state.transient.nodes.get('hovered').get('typoscriptPath')
    } : {})
);

// export const logToConsole = () => expose(
//     'log.to.console',
//     state => console.log(state.transient && state.transient.nodes && state.transient.nodes.toJS())
// );
