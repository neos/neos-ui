import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform} from 'plow-js';
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
    // TODO: workaround to access the frame from outside...
    const nodeElement = document.getElementsByName('neos-content-main')[0].contentDocument.querySelector(`[data-__neos-node-contextpath='${nodeContextPath}']`);

    if (nodeElement && nodeElement.getBoundingClientRect) {
        // TODO: workaround to access the frame from outside...
        const bodyBounds = document.getElementsByName('neos-content-main')[0].contentDocument.body.getBoundingClientRect();
        const domBounds = nodeElement.getBoundingClientRect();

        return {
            x: domBounds.left - bodyBounds.left,
            y: domBounds.top - bodyBounds.top
        };
    }

    return {x: 0, y: 0};
};

@connect($transform({
    focusedNode: CR.Nodes.focusedSelector
}))
export default class NodeToolbar extends Component {
    static propTypes = {
        focusedNode: PropTypes.object.isRequired
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn,
            node: this.props.focusedNode
        };

        const {x, y} = position(this.props.focusedNode.contextPath);

        const classNames = mergeClassNames({
            [style.toolBar]: true
        });

        return (
            <div className={classNames} style={{top: y - 50, left: x}}>
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
