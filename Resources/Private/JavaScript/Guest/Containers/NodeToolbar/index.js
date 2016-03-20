import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
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

@connect($get('inlineToolbar'))
export default class NodeToolbar extends Component {
    static propTypes = {
        ui: PropTypes.object.isRequired,
        connection: PropTypes.object.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        isVisible: PropTypes.bool.isRequired
    };

    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };
        const {x, y, isVisible} = this.props;

        return (
            <div
                className={style.toolBar}
                style={{top: y, left: x, display: isVisible ? 'block' : 'none'}}
                >
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
