import {PureComponent, PropTypes} from 'react';

import {dom} from '../../Helpers/index';

import style from './style.css';

export default class MarkActiveNodeAsFocused extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string
    };

    render() {
        const {contextPath, fusionPath} = this.props;

        if (!contextPath || !fusionPath) {
            return null;
        }

        const nodeElement = dom.findNode(contextPath, fusionPath);
        const oldNode = dom.find(`.${style['markActiveNodeAsFocused--focusedNode']}`);

        if (oldNode) {
            oldNode.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }

        if (nodeElement) {
            nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
        }

        return null;
    }
}
