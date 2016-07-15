import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CR} from 'Host/Selectors/index';
import {$transform, $get} from 'plow-js';
import style from './style.css';

@connect($transform({
    hoveredNode: CR.Nodes.hoveredSelector,
    focusedNode: CR.Nodes.focusedSelector
}))
export default class MarkHoveredNodeAsHovered extends Component {
    render() {

        console.log("hover");
        const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;
        
        const oldNode = iframeDocument.querySelector('.' + style['markHoveredNodeAsHovered'])
        if (oldNode) {
            oldNode.classList.remove(style['markHoveredNodeAsHovered']);
        }


        if (this.props.hoveredNode && this.props.hoveredNode !== this.props.focusedNode) {
            const nodeElement = iframeDocument.querySelector('[data-__neos-node-contextpath=\'' + this.props.hoveredNode.contextPath + '\']'); // TODO: workaround to access the frame from outside...
            if (nodeElement) {
                nodeElement.classList.add(style['markHoveredNodeAsHovered']);
            }
        }

        return null;
    }
}
