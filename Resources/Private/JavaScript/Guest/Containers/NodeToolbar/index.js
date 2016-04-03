import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

@connect($transform({
    toolbar: $get('nodeToolbar'),
    isEditorToolbarVisible: $get('ckEditorToolbar.isVisible')
}))
export default class NodeToolbar extends Component {
    static propTypes = {
        toolbar: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            isVisible: PropTypes.bool.isRequired
        }).isRequired,
        isEditorToolbarVisible: PropTypes.bool.isRequired
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {x, y, isVisible} = this.props.toolbar;
        const {isEditorToolbarVisible} = this.props;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isHidden']]: !isVisible,
            [style['toolBar--isBlurred']]: isEditorToolbarVisible
        });

        return (
            <div className={classNames} style={{top: y, left: x}}>
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
