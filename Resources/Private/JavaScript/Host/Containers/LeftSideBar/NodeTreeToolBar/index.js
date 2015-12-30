import React, {Component} from 'react';
import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    EditSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode
} from './Buttons/';
import style from './style.css';

export default class NodeTreeToolBar extends Component {
    render() {
        return (
            <div className={style.toolBar}>
                <AddNode />
                <EditSelectedNode />
                <HideSelectedNode />
                <CopySelectedNode />
                <CutSelectedNode />
                <PasteClipBoardNode />
                <DeleteSelectedNode />
            </div>
        );
    }
}
