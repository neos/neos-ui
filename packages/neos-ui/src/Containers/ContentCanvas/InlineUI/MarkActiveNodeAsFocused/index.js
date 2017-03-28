import {PureComponent, PropTypes} from 'react';

import {findInGuestFrame, findNodeInGuestFrame} from '@neos-project/neos-ui-guest-frame/src/dom';

import style from './style.css';

export default class MarkActiveNodeAsFocused extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string
    };

    render() {
        const oldNode = findInGuestFrame(`.${style['markActiveNodeAsFocused--focusedNode']}`);

        if (oldNode) {
            oldNode.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }

        const {contextPath, fusionPath} = this.props;

        if (!contextPath) {
            return null;
        }

        const nodeElement = findNodeInGuestFrame(contextPath, fusionPath);

        if (nodeElement) {
            nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
        }

        return null;
    }
}
