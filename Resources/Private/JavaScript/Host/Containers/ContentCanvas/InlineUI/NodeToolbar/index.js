import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';
import {CR} from 'Host/Selectors/index';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

export const position = nodeContextPath => {
    const nodeElement = document.getElementsByName('neos-content-main')[0].contentDocument.querySelector('[data-__neos-node-contextpath=\'' + nodeContextPath + '\']'); // TODO: workaround to access the frame from outside...

    if (nodeElement && nodeElement.getBoundingClientRect) {
        const bodyBounds = document.getElementsByName('neos-content-main')[0].contentDocument.body.getBoundingClientRect(); // TODO: workaround to access the frame from outside...
        const domBounds = nodeElement.getBoundingClientRect();

        return {
            x: domBounds.left - bodyBounds.left,
            y: domBounds.top - bodyBounds.top
        };
    }

    return {x: 0, y: 0};
};


@connect($transform({
    focusedNode: CR.Nodes.focusedSelector,
    isEditorToolbarVisible: $get('guest.editorToolbar.isVisible')
}))
export default class NodeToolbar extends Component {
    static propTypes = {
        focusedNode: PropTypes.object.isRequired,
        isEditorToolbarVisible: PropTypes.bool.isRequired
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn,
            node: this.props.focusedNode
        };

        const {x, y} = position(this.props.focusedNode.contextPath);

        const {isEditorToolbarVisible} = this.props;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            //[style['toolBar--isHidden']]: !isVisible,
            //[style['toolBar--isBlurred']]: isEditorToolbarVisible
        });

        return (
            <div className={classNames} style={{top: y-50, left: x}}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode {...props} />
                    <HideSelectedNode {...props} />
                    <CopySelectedNode {...props} />
                    <CutSelectedNode {...props} />
                    <PasteClipBoardNode {...props} />
                    <DeleteSelectedNode {...props} />
                </div>
            </div>
        );
    }
}
