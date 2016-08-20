import React from 'react';
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

export default () => {
    const childProps = {
        className: style.toolBar__btnGroup__btn
    };

    return (
        <div className={style.toolBar}>
            <div className={style.toolBar__btnGroup}>
                <AddNode {...childProps}/>
                <EditSelectedNode {...childProps}/>
                <HideSelectedNode {...childProps}/>
                <CopySelectedNode {...childProps}/>
                <CutSelectedNode {...childProps}/>
                <PasteClipBoardNode {...childProps}/>
                <DeleteSelectedNode {...childProps}/>
                <RefreshPageTree {...childProps}/>
            </div>
        </div>
    );
};
