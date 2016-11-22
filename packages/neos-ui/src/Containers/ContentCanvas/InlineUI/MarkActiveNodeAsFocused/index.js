import {PureComponent, PropTypes} from 'react';

import style from './style.css';

export default class MarkActiveNodeAsFocused extends PureComponent {
    static propTypes = {
        focusedNode: PropTypes.object
    };

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
            oldNode.childNodes.forEach(childNode => {
                if (childNode.classList && childNode.classList.contains('neos-inline-editable')) {
                    if (childNode.childNodes[0].innerHTML.trim() === '' || childNode.childNodes[0].innerHTML.trim() === '<br>') {
                        childNode.childNodes[0].innerHTML = 'placeholder';
                    }
                }
            });
        }

        if (nodeElement) {
            nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
            nodeElement.childNodes.forEach(childNode => {
                if (childNode.classList && childNode.classList.contains('neos-inline-editable')) {
                    if (childNode.childNodes[0].innerHTML.trim() === 'placeholder') {
                        childNode.childNodes[0].innerHTML = '<br>';
                    }
                }
            });
        }

        return null;
    }
}
