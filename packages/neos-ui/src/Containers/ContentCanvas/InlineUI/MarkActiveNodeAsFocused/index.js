import {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import style from './style.css';

export default class MarkActiveNodeAsFocused extends Component {
    static propTypes = {
        focusedNode: PropTypes.object
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        if (!this.props.focusedNode) {
            return null;
        }

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
