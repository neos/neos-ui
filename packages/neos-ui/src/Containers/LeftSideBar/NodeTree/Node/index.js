import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import {connect} from 'react-redux';

import Tree from '@neos-project/react-ui-components/src/Tree/';
import {stripTags} from '@neos-project/utils-helpers';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';
import style from '../style.css';

const getContextPath = $get('contextPath');

export default class Node extends PureComponent {
    static propTypes = {
        ChildRenderer: PropTypes.func.isRequired,
        node: PropTypes.object,
        nodeTypeRole: PropTypes.string,
        currentlyDraggedNode: PropTypes.object,
        hasChildren: PropTypes.bool,
        childNodes: PropTypes.object,
        currentDocumentNodeContextPath: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,
        uncollapsedNodeContextPaths: PropTypes.object,
        hiddenContextPaths: PropTypes.arrayOf(PropTypes.string),
        intermediateContextPaths: PropTypes.arrayOf(PropTypes.string),
        loadingNodeContextPaths: PropTypes.object,
        errorNodeContextPaths: PropTypes.object,
        canBeInserted: PropTypes.bool,

        nodeTypesRegistry: PropTypes.object.isRequired,

        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,
        onNodeDrag: PropTypes.func,
        onNodeDrop: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleNodeToggle = this.handleNodeToggle.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleNodeLabelClick = this.handleNodeLabelClick.bind(this);
    }

    accepts = () => {
        const {node, currentlyDraggedNode, canBeInserted} = this.props;

        return canBeInserted && (getContextPath(currentlyDraggedNode) !== getContextPath(node));
    }

    handleNodeDrag = () => {
        const {node, onNodeDrag} = this.props;

        onNodeDrag(node);
    }

    handleNodeDrop = () => {
        const {node, onNodeDrop} = this.props;

        onNodeDrop(node);
    }

    getIcon() {
        const {node, nodeTypesRegistry} = this.props;
        const nodeType = $get('nodeType', node);

        return $get('ui.icon', nodeTypesRegistry.get(nodeType));
    }

    isFocused() {
        const {node, focusedNodeContextPath} = this.props;

        return focusedNodeContextPath === $get('contextPath', node);
    }

    isActive() {
        const {node, currentDocumentNodeContextPath} = this.props;

        return currentDocumentNodeContextPath === $get('contextPath', node);
    }

    isCollapsed() {
        const {node, uncollapsedNodeContextPaths} = this.props;

        return !uncollapsedNodeContextPaths.includes($get('contextPath', node));
    }

    isHidden() {
        const {node, hiddenContextPaths} = this.props;
        return hiddenContextPaths && hiddenContextPaths.includes($get('contextPath', node));
    }

    isIntermediate() {
        const {node, intermediateContextPaths} = this.props;
        return intermediateContextPaths && intermediateContextPaths.includes($get('contextPath', node));
    }

    isLoading() {
        const {node, loadingNodeContextPaths} = this.props;

        return loadingNodeContextPaths ? loadingNodeContextPaths.includes($get('contextPath', node)) : false;
    }

    hasError() {
        const {node, errorNodeContextPaths} = this.props;

        return errorNodeContextPaths ? errorNodeContextPaths.includes($get('contextPath', node)) : false;
    }

    getDragAndDropContext() {
        return {
            onDrag: this.handleNodeDrag,
            onDrop: this.handleNodeDrop,
            accepts: this.accepts
        };
    }

    render() {
        const {
            ChildRenderer,
            node,
            nodeTypeRole,
            childNodes,
            hasChildren,
            onNodeToggle,
            onNodeClick,
            onNodeFocus,
            onNodeDrag,
            onNodeDrop,
            currentlyDraggedNode
        } = this.props;

        if (this.isHidden()) {
            return null;
        }

        return (
            <Tree.Node>
                <Tree.Node.Header
                    hasChildren={hasChildren}
                    isCollapsed={this.isCollapsed()}
                    isActive={this.isActive()}
                    isFocused={this.isFocused()}
                    isLoading={this.isLoading()}
                    isHidden={$get('properties._hidden', node)}
                    isHiddenInIndex={$get('properties._hiddenInIndex', node) || this.isIntermediate()}
                    hasError={this.hasError()}
                    label={stripTags($get('label', node))}
                    icon={this.getIcon()}
                    onToggle={this.handleNodeToggle}
                    onClick={this.handleNodeClick}
                    onLabelClick={this.handleNodeLabelClick}
                    dragAndDropContext={this.getDragAndDropContext()}
                    />
                {this.isCollapsed() ? null : (
                    <Tree.Node.Contents>
                        {childNodes.filter(n => n).map(node =>
                            <ChildRenderer
                                ChildRenderer={ChildRenderer}
                                key={$get('contextPath', node)}
                                node={node}
                                nodeTypeRole={nodeTypeRole}
                                onNodeToggle={onNodeToggle}
                                onNodeClick={onNodeClick}
                                onNodeFocus={onNodeFocus}
                                onNodeDrag={onNodeDrag}
                                onNodeDrop={onNodeDrop}
                                currentlyDraggedNode={currentlyDraggedNode}
                                />
                        )}
                    </Tree.Node.Contents>
                )}
            </Tree.Node>
        );
    }

    handleNodeToggle() {
        const {node, onNodeToggle} = this.props;
        onNodeToggle($get('contextPath', node));
    }

    handleNodeClick() {
        const {node, onNodeFocus, onNodeClick} = this.props;
        onNodeFocus($get('contextPath', node));
        onNodeClick($get('uri', node), $get('contextPath', node));
    }

    handleNodeLabelClick() {
        const {node, onNodeFocus, onNodeClick} = this.props;
        onNodeFocus($get('contextPath', node));
        onNodeClick($get('uri', node), $get('contextPath', node));
    }
}

const withNodeTypeRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

export const PageTreeNode = withNodeTypeRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const allowedNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'));

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeInsertedSelector = selectors.CR.Nodes.makeCanBeInsertedSelector(nodeTypesRegistry);

        return (state, {node, currentlyDraggedNode}) => ({
            className: $get('intermediate')(node) ? style.pageTree__intermediateNode : null,
            childNodes: childrenOfSelector(state, getContextPath(node)),
            hasChildren: hasChildrenSelector(state, getContextPath(node)),
            currentDocumentNodeContextPath: selectors.UI.ContentCanvas.getCurrentContentCanvasContextPath(state),
            focusedNodeContextPath: selectors.UI.PageTree.getFocused(state),
            uncollapsedNodeContextPaths: selectors.UI.PageTree.getUncollapsed(state),
            hiddenContextPaths: selectors.UI.PageTree.getHidden(state),
            intermediateContextPaths: selectors.UI.PageTree.getIntermediate(state),
            loadingNodeContextPaths: selectors.UI.PageTree.getLoading(state),
            errorNodeContextPaths: selectors.UI.PageTree.getErrors(state),
            canBeInserted: canBeInsertedSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            })
        });
    }, {
        onNodeFocus: actions.UI.PageTree.focus
    }
)(Node));

export const ContentTreeNode = withNodeTypeRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const allowedNodeTypes = [].concat(
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('content')),
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('contentCollection'))
        );

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeInsertedSelector = selectors.CR.Nodes.makeCanBeInsertedSelector(nodeTypesRegistry);

        return (state, {node, currentlyDraggedNode}) => ({
            childNodes: childrenOfSelector(state, getContextPath(node)),
            hasChildren: hasChildrenSelector(state, getContextPath(node)),
            currentDocumentNodeContextPath: $get('cr.nodes.focused.contextPath', state),
            focusedNodeContextPath: $get('cr.nodes.focused.contextPath', state),
            uncollapsedNodeContextPaths: selectors.UI.ContentTree.getUncollapsed(state),
            canBeInserted: canBeInsertedSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            })
        });
    }, {
        onNodeFocus: actions.CR.Nodes.focus
    }
)(Node));
