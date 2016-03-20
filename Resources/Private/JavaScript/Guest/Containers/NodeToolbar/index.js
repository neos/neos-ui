import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$get} from 'plow-js';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/index';
import style from './style.css';

@connect($get('nodeToolbar'))
export default class NodeToolbar extends Component {
    static propTypes = {
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {x, y, isVisible} = this.props;
        const classNames = mergeClassNames({
            [style.toolBar]: true,
            [style['toolBar--isHidden']]: !isVisible
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
