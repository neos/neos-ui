import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import mergeClassNames from 'classnames';

import {Tree, Icon} from '@neos-project/react-ui-components';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {SelectionModeTypes} from '@neos-project/neos-ts-interfaces';
import {dndTypes} from '@neos-project/neos-ui-constants';

import {PageTreeNode, ContentTreeNode} from './Node/index';

import style from './style.module.css';
import {neos} from '@neos-project/neos-ui-decorators';

const ConnectedDragLayer = connect((state, {currentlyDraggedNodes}) => {
    const getNodeByContextPath = selectors.CR.Nodes.nodeByContextPath(state);
    return {
        currentlyDraggedNodes: currentlyDraggedNodes ? currentlyDraggedNodes.map(contextPath => getNodeByContextPath(contextPath)) : []
    };
})(Tree.DragLayer);

export default class NodeTree extends PureComponent {
    static propTypes = {
        ChildRenderer: PropTypes.func,
        rootNode: PropTypes.object,
        allowOpeningNodesInNewWindow: PropTypes.bool,
        nodeTypeRole: PropTypes.string,
        toggle: PropTypes.func,
        collapseAll: PropTypes.func,
        focus: PropTypes.func,
        requestScrollIntoView: PropTypes.func,
        setActiveContentCanvasSrc: PropTypes.func,
        setActiveContentCanvasContextPath: PropTypes.func,
        moveNodes: PropTypes.func,
        allCollapsibleNodes: PropTypes.object,
        loadingDepth: PropTypes.number
    };

    state = {
        currentlyDraggedNodes: []
    };

    handleToggle = contextPath => {
        const {toggle} = this.props;

        toggle(contextPath);
    }

    handleCollapseAll = () => {
        const {collapseAll, allCollapsibleNodes, rootNode, loadingDepth} = this.props
        let nodeContextPaths = []
        const collapsedByDefaultNodesContextPaths = []

        Object.values(allCollapsibleNodes).forEach(node => {
            const collapsedByDefault = loadingDepth === 0 ? false : node.depth - rootNode.depth >= loadingDepth
            if (collapsedByDefault) {
                collapsedByDefaultNodesContextPaths.push(node.contextPath)
            } else {
                nodeContextPaths.push(node.contextPath)
            }
        });

        // Do not Collapse RootNode
        nodeContextPaths = nodeContextPaths.filter(i => i !== rootNode.contextPath);
        collapseAll(nodeContextPaths, collapsedByDefaultNodesContextPaths);
    }

    handleFocus = (contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed) => {
        const {focus} = this.props;

        if (altKeyPressed) {
            return;
        }
        const selectionMode = shiftKeyPressed ? SelectionModeTypes.RANGE_SELECT : (metaKeyPressed ? SelectionModeTypes.MULTIPLE_SELECT : SelectionModeTypes.SINGLE_SELECT);

        focus(contextPath, undefined, selectionMode);
    }

    handleClick = (src, contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed) => {
        const {setActiveContentCanvasSrc, setActiveContentCanvasContextPath, requestScrollIntoView} = this.props;
        if (altKeyPressed) {
            window.open(window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + '?node=' + contextPath);
            return;
        }

        if (metaKeyPressed || shiftKeyPressed) {
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
            currentlyDraggedNodes:
                this.props.focusedNodesContextPaths.includes(node.contextPath) ?
                    this.props.focusedNodesContextPaths :
                    [node.contextPath] // moving a node outside of focused nodes
        });
    }

    handeEndDrag = () => {
        this.setState({
            currentlyDraggedNodes: []
        });
    }

    handleDrop = (targetNode, position) => {
        const {currentlyDraggedNodes} = this.state;
        const {moveNodes, focus} = this.props;
        moveNodes(currentlyDraggedNodes, $get('contextPath', targetNode), position);
        // We need to refocus the tree, so all focus would be reset, because its context paths have changed while moving
        // Could be removed with the new CR
        focus($get('contextPath', targetNode));

        this.setState({
            currentlyDraggedNodes: []
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
                <a
                    role="button"
                    onClick={this.handleCollapseAll}
                    className={style.collapseAll}
                >
                    Collapse All
                </a>
                <ConnectedDragLayer
                    nodeDndType={dndTypes.NODE}
                    ChildRenderer={ChildRenderer}
                    currentlyDraggedNodes={this.state.currentlyDraggedNodes}
                />
                <ChildRenderer
                    ChildRenderer={ChildRenderer}
                    nodeDndType={dndTypes.NODE}
                    node={rootNode}
                    level={1}
                    onNodeToggle={this.handleToggle}
                    onToggleChildren={this.handleToggleChildren}
                    onNodeClick={this.handleClick}
                    onNodeFocus={this.handleFocus}
                    onNodeDrag={this.handleDrag}
                    onNodeDrop={this.handleDrop}
                    onNodeEndDrag={this.handeEndDrag}
                    currentlyDraggedNodes={this.state.currentlyDraggedNodes}
                />
            </Tree>
        );
    }
}

const withNodeTypeRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

export const PageTree = withNodeTypeRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const documentNodesSelector = selectors.CR.Nodes.makeGetCollapsibleDocumentNodes(nodeTypesRegistry);
        return ({
            rootNode: selectors.CR.Nodes.siteNodeSelector(state),
            focusedNodesContextPaths: selectors.UI.PageTree.getAllFocused(state),
            ChildRenderer: PageTreeNode,
            allowOpeningNodesInNewWindow: true,
            loadingDepth: neos.configuration.structureTree.loadingDepth,
            allCollapsibleNodes: documentNodesSelector(state)
        })
    }, {
        toggle: actions.UI.PageTree.toggle,
        collapseAll: actions.UI.PageTree.collapseAll,
        focus: actions.UI.PageTree.focus,
        setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
        setActiveContentCanvasContextPath: actions.CR.Nodes.setDocumentNode,
        moveNodes: actions.CR.Nodes.moveMultiple,
        requestScrollIntoView: null,
        isContentTree: false
    }, (stateProps, dispatchProps, ownProps) => {
        return Object.assign({}, stateProps, dispatchProps, ownProps);
    }
)(NodeTree));

export const ContentTree = withNodeTypeRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const contentNodesSelector = selectors.CR.Nodes.makeGetCollapsibleContentNodes(nodeTypesRegistry);
        return ({
            rootNode: selectors.CR.Nodes.documentNodeSelector(state),
            focusedNodesContextPaths: selectors.CR.Nodes.focusedNodePathsSelector(state),
            ChildRenderer: ContentTreeNode,
            allowOpeningNodesInNewWindow: false,
            loadingDepth: neos.configuration.structureTree.loadingDepth,
            allCollapsibleNodes: contentNodesSelector(state)
        })
    }, {
        toggle: actions.UI.ContentTree.toggle,
        collapseAll: actions.UI.ContentTree.collapseAll,
        focus: actions.CR.Nodes.focus,
        moveNodes: actions.CR.Nodes.moveMultiple,
        requestScrollIntoView: actions.UI.ContentCanvas.requestScrollIntoView,
        isContentTree: true
    }, (stateProps, dispatchProps, ownProps) => {
        return Object.assign({}, stateProps, dispatchProps, ownProps);
    }
)(NodeTree));
