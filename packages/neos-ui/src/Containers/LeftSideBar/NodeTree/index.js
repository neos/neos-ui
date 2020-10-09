import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import mergeClassNames from 'classnames';

import {Tree, Icon} from '@neos-project/react-ui-components';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {dndTypes} from '@neos-project/neos-ui-constants';

import {PageTreeNode, ContentTreeNode} from './Node/index';

import style from './style.css';

export default class NodeTree extends PureComponent {
    static propTypes = {
        ChildRenderer: PropTypes.func,
        rootNode: PropTypes.object,
        allowOpeningNodesInNewWindow: PropTypes.bool,
        nodeTypeRole: PropTypes.string,
        toggle: PropTypes.func,
        focus: PropTypes.func,
        requestScrollIntoView: PropTypes.func,
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

    handleFocus = (contextPath, openInNewWindow) => {
        const {focus, allowOpeningNodesInNewWindow} = this.props;
        if (openInNewWindow && allowOpeningNodesInNewWindow) {
            // We do not need to change focus if we open the clicked node in the new window.
            return;
        }

        focus(contextPath);
    }

    handleClick = (src, contextPath, openInNewWindow) => {
        const {setActiveContentCanvasSrc, setActiveContentCanvasContextPath, requestScrollIntoView, allowOpeningNodesInNewWindow} = this.props;
        if (openInNewWindow && allowOpeningNodesInNewWindow) {
            window.open(window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + '?node=' + contextPath);
            return;
        }

        // Set a flag that will imperatively tell ContentCanvas to scroll to focused node
        if (requestScrollIntoView) {
            requestScrollIntoView(true);
        }
        if (setActiveContentCanvasSrc) {
            setActiveContentCanvasSrc(src);
        }
        if (setActiveContentCanvasContextPath) {
            setActiveContentCanvasContextPath(contextPath);
        }
    }

    handleDrag = node => {
        this.setState({
            currentlyDraggedNode: node
        });
    }

    handleDrop = (targetNode, position) => {
        const {currentlyDraggedNode} = this.state;
        const {moveNode} = this.props;
        moveNode($get('contextPath', currentlyDraggedNode), $get('contextPath', targetNode), position);

        this.setState({
            currentlyDraggedNode: null
        });
    }

    render() {
        const {rootNode, ChildRenderer} = this.props;
        if (!rootNode) {
            return (
                <div className={style.loader}>
                    <Icon icon="spinner" spin={true} />
                </div>
            );
        }

        const classNames = mergeClassNames({
            [style.pageTree]: true
        });

        return (
            <Tree className={classNames}>
                <ChildRenderer
                    ChildRenderer={ChildRenderer}
                    nodeDndType={dndTypes.NODE}
                    node={rootNode}
                    level={1}
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
    ChildRenderer: PageTreeNode,
    allowOpeningNodesInNewWindow: true
}), {
    toggle: actions.UI.PageTree.toggle,
    focus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.CR.Nodes.setDocumentNode,
    moveNode: actions.CR.Nodes.move,
    requestScrollIntoView: null
})(NodeTree);

export const ContentTree = connect(state => ({
    rootNode: selectors.CR.Nodes.documentNodeSelector(state),
    ChildRenderer: ContentTreeNode,
    allowOpeningNodesInNewWindow: false
}), {
    toggle: actions.UI.ContentTree.toggle,
    focus: actions.CR.Nodes.focus,
    moveNode: actions.CR.Nodes.move,
    requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView
})(NodeTree);
