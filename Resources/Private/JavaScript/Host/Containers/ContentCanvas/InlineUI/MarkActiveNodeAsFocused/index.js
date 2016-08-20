import {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {CR} from 'Host/Selectors/index';
import {$transform} from 'plow-js';
import style from './style.css';
import {node as NodePropType} from 'Shared/PropTypes/CR/Node/index';

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class MarkActiveNodeAsFocused extends Component {
    static propTypes = {
        focusedNode: NodePropType
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;
        // TODO: workaround to access the frame from outside...
        const nodeElement = iframeDocument.querySelector(`[data-__neos-node-contextpath='${this.props.focusedNode.contextPath}']`);

        const oldNode = iframeDocument.querySelector(`.${style['markActiveNodeAsFocused--focusedNode']}`);
        if (oldNode) {
            oldNode.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }

        if (nodeElement) {
            nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
        }

        return null;
    }
}
