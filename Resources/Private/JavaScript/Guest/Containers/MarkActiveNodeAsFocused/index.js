import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CR} from 'Host/Selectors/index';
import {$transform, $get} from 'plow-js';
import style from './style.css';

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class MarkActiveNodeAsFocused extends Component {
    render() {

        const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;
        const nodeElement = iframeDocument.querySelector('[data-__neos-node-contextpath=\'' + this.props.focusedNode.contextPath + '\']'); // TODO: workaround to access the frame from outside...
        
        const oldNode = iframeDocument.querySelector('.' + style['markActiveNodeAsFocused--focusedNode'])
        if (oldNode) {
            oldNode.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }

        if (nodeElement) {
            nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
        }

        console.log("Mark active node as focused", this.props.focusedNode);

        return null;
    }
}
