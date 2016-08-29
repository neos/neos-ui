import React, {Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import NodeToolbar from './NodeToolbar/index';
import MarkActiveNodeAsFocused from './MarkActiveNodeAsFocused/index';
import MarkHoveredNodeAsHovered from './MarkHoveredNodeAsHovered/index';

import style from './style.css';

export default class InlineUI extends Component {
    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        return (
            <div className={style.inlineUi}>
                <NodeToolbar/>
                <MarkActiveNodeAsFocused/>
                <MarkHoveredNodeAsHovered/>
            </div>
        );

        // TODO: re-add EditorToolbar
    }
}
