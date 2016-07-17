import {position} from 'Guest/Process/DOMUtils.js';
import {actions} from 'Guest/Redux/index';

export default (ui, connection, dispatch) => {
    //
    // Connect to nodes.focused and inform the node toolbar about the new position
    //
    connection.observe('nodes.focused').react(({node, typoscriptPath}) => {
        if (node && typoscriptPath) {
            const dom = document.querySelector(
                `[data-__neos-typoscript-path="${typoscriptPath}"][data-__neos-node-contextpath="${node.contextPath}"]`
            );
            const {x, y} = position(dom);

            dispatch(actions.NodeToolbar.setPosition(x - 9, y - 49));
            dispatch(actions.NodeToolbar.setNode(node));
            dispatch(actions.NodeToolbar.show());
        } else {
            dispatch(actions.NodeToolbar.hide());
        }
    });
};
