import {position} from 'Guest/Process/DOMUtils.js';
import {actions} from 'Guest/Redux/index';

export default (ui, connection, dispatch) => {
    //
    // Connect to nodes.focused and inform the inline toolbar about the new position
    //
    connection.observe('nodes.focused').react(({node, typoscriptPath}) => {
        if (node && typoscriptPath) {
            const dom = document.querySelector(
                `[data-__che-typoscript-path="${typoscriptPath}"][data-__che-node-contextpath="${node.contextPath}"]`
            );
            const {x, y} = position(dom);

            dispatch(actions.InlineToolbar.setPosition(x - 9, y - 49));
            dispatch(actions.InlineToolbar.show());
        } else {
            dispatch(actions.InlineToolbar.hide());
        }
    });
};
