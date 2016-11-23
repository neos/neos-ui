import {PureComponent, PropTypes} from 'react';

import style from './style.css';

export default class MarkHoveredNodeAsHovered extends PureComponent {
    static propTypes = {
        hoveredNode: PropTypes.object,
        focusedNode: PropTypes.object
    };

    render() {
        const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;

        const oldNode = iframeDocument.querySelector(`.${style.markHoveredNodeAsHovered}`);
        if (oldNode) {
            oldNode.classList.remove(style.markHoveredNodeAsHovered);
        }

        if (this.props.hoveredNode && this.props.hoveredNode !== this.props.focusedNode) {
            // TODO: workaround to access the frame from outside...
            const nodeElement = iframeDocument.querySelector(`[data-__neos-node-contextpath='${this.props.hoveredNode.contextPath}']`);
            if (nodeElement) {
                nodeElement.classList.add(style.markHoveredNodeAsHovered);
            }
        }

        return null;
    }
}
