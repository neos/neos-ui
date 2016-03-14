import React, {Component} from 'react';
import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    EditSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode,
    RefreshPageTree
} from './Buttons/index';
import style from './style.css';

export default class NodeTreeToolBar extends Component {
    render() {
        const props = {
            className: style.toolBar__btnGroup__btn
        };

        return (
            <div className={style.toolBar}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode {...props} />
                    <EditSelectedNode {...props} />
                    <HideSelectedNode {...props} />
                    <CopySelectedNode {...props} />
                    <CutSelectedNode {...props} />
                    <PasteClipBoardNode {...props} />
                    <DeleteSelectedNode {...props} />
                    <RefreshPageTree {...props} />
                </div>
            </div>
        );
    }
}
