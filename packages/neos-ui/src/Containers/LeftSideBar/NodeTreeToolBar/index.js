import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {neos} from '@neos-project/neos-ui-decorators';
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

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class NodeTreeToolBar extends Component {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired
    }

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        const {nodeTypesRegistry} = this.props;
        const childProps = {
            className: style.toolBar__btnGroup__btn,
            nodeTypesRegistry
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
    }
}
