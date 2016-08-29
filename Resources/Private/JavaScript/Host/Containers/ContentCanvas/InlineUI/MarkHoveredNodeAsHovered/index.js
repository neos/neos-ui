import {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {CR} from 'Host/Selectors/index';
import {$transform} from 'plow-js';
import style from './style.css';
import {storedNode as NodePropType} from 'Shared/PropTypes/CR/Node/index';

@connect($transform({
    hoveredNode: CR.Nodes.hoveredSelector,
    focusedNode: CR.Nodes.focusedSelector
}))
export default class MarkHoveredNodeAsHovered extends Component {
    static propTypes = {
        hoveredNode: NodePropType,
        focusedNode: NodePropType
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

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
