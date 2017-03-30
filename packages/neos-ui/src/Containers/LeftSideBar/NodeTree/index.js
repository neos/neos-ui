import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import Tree from '@neos-project/react-ui-components/src/Tree/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import {PageTreeNode, ContentTreeNode} from './Node/index';

import style from './style.css';

export default class NodeTree extends PureComponent {
    static propTypes = {
        ChildRenderer: PropTypes.func,
        rootNode: PropTypes.object,
        nodeTypeRole: PropTypes.string,
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

        if (setActiveContentCanvasSrc && setActiveContentCanvasContextPath) {
            setActiveContentCanvasSrc(src);
            setActiveContentCanvasContextPath(contextPath);
        }
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
        const {rootNode, ChildRenderer} = this.props;
        if (!rootNode) {
            return (<div>...</div>);
        }

        return (
            <Tree className={style.pageTree}>
                <ChildRenderer
                    ChildRenderer={ChildRenderer}
                    node={rootNode}
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

export const PageTree = connect(state => ({
    rootNode: selectors.CR.Nodes.siteNodeSelector(state),
    ChildRenderer: PageTreeNode
}), {
    toggle: actions.UI.PageTree.toggle,
    focus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.UI.ContentCanvas.setContextPath,
    moveNode: actions.CR.Nodes.move
})(NodeTree);

export const ContentTree = connect(state => ({
    rootNode: selectors.UI.ContentCanvas.documentNodeSelector(state),
    ChildRenderer: ContentTreeNode
}), {
    toggle: actions.UI.ContentTree.toggle,
    focus: actions.CR.Nodes.focus,
    moveNode: actions.CR.Nodes.move
})(NodeTree);
