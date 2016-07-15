import React, {Component} from 'react';

import NodeToolbar from '../NodeToolbar/index';
import EditorToolbar from '../EditorToolbar/index';
import MarkActiveNodeAsFocused from '../MarkActiveNodeAsFocused/index';
import MarkHoveredNodeAsHovered from '../MarkHoveredNodeAsHovered/index';

import style from './style.css';

export default class InlineUI extends Component {
    render() {
        return (
            <div className={style.inlineUi}>
                <NodeToolbar />
                <MarkActiveNodeAsFocused />
                <MarkHoveredNodeAsHovered />
            </div>
        );

        // TODO: re-add EditorToolbar
    }
}
