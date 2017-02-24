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
    toggle: actions.UI.PageTree.toggle,
    focus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.UI.ContentCanvas.setContextPath,
    moveNode: actions.CR.Nodes.move
})
export default class PageTree extends PureComponent {
    static propTypes = {
        siteNode: PropTypes.object,
        pageTreeState: PropTypes.object.isRequired,

        toggle: PropTypes.func,
        focus: PropTypes.func,
        setActiveContentCanvasSrc: PropTypes.func,
        setActiveContentCanvasContextPath: PropTypes.func,
        moveNode: PropTypes.func
    };

    state = {
        currentlyDraggedNode: null
    };

    handleToggle = contextPath => {
        const {toggle} = this.props;

        toggle(contextPath);
    }

    handleFocus = contextPath => {
        const {focus} = this.props;

        focus(contextPath);
    }

    handleClick = (src, contextPath) => {
        const {setActiveContentCanvasSrc, setActiveContentCanvasContextPath} = this.props;

        setActiveContentCanvasSrc(src);
        setActiveContentCanvasContextPath(contextPath);
    }

    handleDrag = node => {
        this.setState({
            currentlyDraggedNode: node
        });
    }

    handleDrop = targetNode => {
        const {currentlyDraggedNode} = this.state;
        const {moveNode} = this.props;

        moveNode($get('contextPath', currentlyDraggedNode), $get('contextPath', targetNode));

        this.setState({
            currentlyDraggedNode: null
        });
    }

    render() {
        const {siteNode} = this.props;
        if (!siteNode) {
            return (<div>...</div>);
        }

        return (
            <Tree className={style.pageTree}>
                <Node
                    ChildRenderer={Node}
                    node={siteNode}
                    onNodeToggle={this.handleToggle}
                    onNodeClick={this.handleClick}
                    onNodeFocus={this.handleFocus}
                    onNodeDrag={this.handleDrag}
                    onNodeDrop={this.handleDrop}
                    currentlyDraggedNode={this.state.currentlyDraggedNode}
                    />
            </Tree>
        );
    }
}
