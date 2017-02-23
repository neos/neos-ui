import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import Node from './Node/index';

import style from './style.css';

@connect($transform({
    siteNode: selectors.CR.Nodes.siteNodeSelector,
    pageTreeState: $get('ui.pageTree')
}), {
    onNodeToggle: actions.UI.PageTree.toggle,
    onNodeFocus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.UI.ContentCanvas.setContextPath,
    moveNode: actions.CR.Nodes.move
})
export default class PageTree extends PureComponent {
    static propTypes = {
        siteNode: PropTypes.object,
        pageTreeState: PropTypes.object.isRequired,

        onNodeToggle: PropTypes.func,
        onNodeFocus: PropTypes.func,
        setActiveContentCanvasSrc: PropTypes.func,
        setActiveContentCanvasContextPath: PropTypes.func,
        moveNode: PropTypes.func
    };

    state = {
        currentlyDraggedNode: null
    };

    handleNodeDrag = node => {
        this.setState({
            currentlyDraggedNode: node
        });
    };

    handleNodeDrop = targetNode => {
        const {currentlyDraggedNode} = this.state;
        const {moveNode} = this.props;

        moveNode($get('contextPath', currentlyDraggedNode), $get('contextPath', targetNode));

        this.setState({
            currentlyDraggedNode: null
        });
    };

    constructor(props) {
        super(props);

        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    render() {
        const {siteNode, onNodeToggle, onNodeFocus} = this.props;
        if (!siteNode) {
            return (<div>...</div>);
        }

        return (
            <Tree className={style.pageTree}>
                <Node
                    ChildRenderer={Node}
                    node={siteNode}
                    onNodeToggle={onNodeToggle}
                    onNodeClick={this.handleNodeClick}
                    onNodeFocus={onNodeFocus}
                    onNodeDrag={this.handleNodeDrag}
                    onNodeDrop={this.handleNodeDrop}
                    currentlyDraggedNode={this.state.currentlyDraggedNode}
                    />
            </Tree>
        );
    }

    handleNodeClick(src, contextPath) {
        const {setActiveContentCanvasSrc, setActiveContentCanvasContextPath} = this.props;

        setActiveContentCanvasSrc(src);
        setActiveContentCanvasContextPath(contextPath);
    }
}
