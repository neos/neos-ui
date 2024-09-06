import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import flowright from 'lodash.flowright';
import {Tree, Icon} from '@neos-project/react-ui-components';
import {stripTags, decodeHtml} from '@neos-project/utils-helpers';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';
import {neos} from '@neos-project/neos-ui-decorators';

import hashSum from 'hash-sum';
import {urlWithParams} from '@neos-project/utils-helpers/src/urlWithParams';

const getContextPath = node => node?.contextPath;

//
// Finds the first parent element that has a scrollbar
//
const findScrollingParent = parentElement => {
    if (parentElement.scrollHeight > parentElement.offsetHeight) {
        return parentElement;
    }
    if (parentElement.parentElement) {
        return findScrollingParent(parentElement.parentElement);
    }
    return null;
};

const getOrDefault = defaultValue => value => value || defaultValue;

const decodeLabel = flowright(
    decodeHtml,
    stripTags,
    getOrDefault('')
);

@connect(
    state => ({
        isWorkspaceReadOnly: selectors.CR.Workspaces.isWorkspaceReadOnlySelector(state)
    })
)
export default class Node extends PureComponent {
    state = {
        shouldScrollIntoView: false
    };

    static propTypes = {
        isContentTreeNode: PropTypes.bool,
        rootNode: PropTypes.object,
        loadingDepth: PropTypes.number,
        ChildRenderer: PropTypes.func.isRequired,
        node: PropTypes.object,
        nodeDndType: PropTypes.string.isRequired,
        nodeTypeRole: PropTypes.string,
        currentlyDraggedNodes: PropTypes.array,
        hasChildren: PropTypes.bool,
        isLastChild: PropTypes.bool,
        childNodes: PropTypes.array,
        level: PropTypes.number.isRequired,
        isActive: PropTypes.bool,
        isFocused: PropTypes.bool,
        toggledNodeContextPaths: PropTypes.array,
        visibleContextPaths: PropTypes.array,
        intermediateContextPaths: PropTypes.array,
        loadingNodeContextPaths: PropTypes.array,
        errorNodeContextPaths: PropTypes.array,
        canBeInsertedAlongside: PropTypes.bool,
        canBeInsertedInto: PropTypes.bool,
        isNodeDirty: PropTypes.bool.isRequired,

        areFocusedNodesNestedInEachOther: PropTypes.bool,
        isWorkspaceReadOnly: PropTypes.bool,

        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,

        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,
        onNodeDrag: PropTypes.func,
        onNodeEndDrag: PropTypes.func,
        onNodeDrop: PropTypes.func
    };

    componentDidMount() {
        // Always request scroll on first render if given node is focused
        if (this.props.isFocused) {
            this.setState({
                shouldScrollIntoView: true
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // If focused node changed
        if (this.props.isFocused !== nextProps.isFocused) {
            // And it is the current node
            if (nextProps.isFocused) {
                // Request scrolling itself into view
                this.setState({
                    shouldScrollIntoView: true
                });
            }
        }
    }

    componentDidUpdate() {
        this.scrollFocusedNodeIntoView();
    }

    scrollFocusedNodeIntoView() {
        if (this.state.shouldScrollIntoView && this.domNode) {
            const scrollingElement = findScrollingParent(this.domNode);
            if (scrollingElement) {
                const nodeTopPosition = this.domNode.getBoundingClientRect().top;
                const offset = 50;
                const scrollingElementPosition = scrollingElement.getBoundingClientRect();
                const nodeIsNotInView = nodeTopPosition < scrollingElementPosition.top + offset || nodeTopPosition > scrollingElementPosition.bottom - offset;
                if (nodeIsNotInView) {
                    scrollingElement.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
                }
                this.setState({
                    shouldScrollIntoView: false
                });
            }
        }
    }

    accepts = mode => {
        const {node, currentlyDraggedNodes, canBeInsertedAlongside, canBeInsertedInto} = this.props;
        const canBeInserted = mode === 'into' ? canBeInsertedInto : canBeInsertedAlongside;

        return currentlyDraggedNodes.length > 0 && canBeInserted && !currentlyDraggedNodes.includes(getContextPath(node));
    }

    handleNodeDrag = () => {
        const {node, onNodeDrag} = this.props;

        onNodeDrag(node);
    }

    handleNodeEndDrag = () => {
        const {node, onNodeEndDrag} = this.props;

        onNodeEndDrag(node);
    }

    handleNodeDrop = position => {
        const {node, onNodeDrop} = this.props;

        onNodeDrop(node, position);
    }

    getIcon() {
        const {node, nodeTypesRegistry} = this.props;
        const nodeType = node?.nodeType;

        return nodeTypesRegistry.get(nodeType)?.ui?.icon;
    }

    /**
     * This function will render some additons to the nodetype icon
     * if the page is (currently) hidden
     */
    getCustomIconComponent() {
        const {node} = this.props;

        const isDisabled = node?.properties?._hidden;
        const hasTimeableNodeVisibility = node?.properties?._hasTimeableNodeVisibility;

        if (hasTimeableNodeVisibility) {
            const circleColor = isDisabled ? 'error' : 'primaryBlue';

            return (
                <span className="fa-layers fa-fw">
                    <Icon icon={this.getIcon()} />
                    <Icon icon="circle" color={circleColor} transform="shrink-5 down-6 right-4" />
                    <Icon icon="clock" transform="shrink-9 down-6 right-4" />
                </span>
            );
        }
        if (isDisabled) {
            return (
                <span className="fa-layers fa-fw">
                    <Icon icon={this.getIcon()} />
                    <Icon icon="circle" color="error" transform="shrink-3 down-6 right-4" />
                    <Icon icon="times" transform="shrink-7 down-6 right-4" />
                </span>
            );
        }

        return null;
    }

    getNodeTypeLabel() {
        const {node, nodeTypesRegistry, i18nRegistry} = this.props;
        const nodeType = node?.nodeType;
        const nodeTypeLabel = nodeTypesRegistry.get(nodeType)?.ui?.label;
        return i18nRegistry.translate(nodeTypeLabel, nodeTypeLabel);
    }

    isFocused() {
        const {isFocused} = this.props;

        return isFocused;
    }

    isActive() {
        const {isActive, isContentTreeNode} = this.props;
        if (isContentTreeNode) {
            return this.isFocused();
        }
        return isActive;
    }

    isCollapsed() {
        const {node, toggledNodeContextPaths, rootNode, loadingDepth} = this.props;

        const isToggled = toggledNodeContextPaths.includes(node.contextPath);
        return isNodeCollapsed(node, isToggled, rootNode, loadingDepth);
    }

    isVisible() {
        const {node, visibleContextPaths} = this.props;
        return !Array.isArray(visibleContextPaths) || visibleContextPaths.includes(node.contextPath);
    }

    isIntermediate() {
        const {node, intermediateContextPaths} = this.props;
        return intermediateContextPaths && intermediateContextPaths.includes(node.contextPath);
    }

    isLoading() {
        const {node, loadingNodeContextPaths} = this.props;

        return loadingNodeContextPaths ? loadingNodeContextPaths.includes(node.contextPath) : false;
    }

    hasError() {
        const {node, errorNodeContextPaths} = this.props;

        return errorNodeContextPaths ? errorNodeContextPaths.includes(node.contextPath) : false;
    }

    getDragAndDropContext() {
        return {
            onDrag: this.handleNodeDrag,
            onEndDrag: this.handleNodeEndDrag,
            onDrop: this.handleNodeDrop,
            accepts: this.accepts
        };
    }

    render() {
        const {
            ChildRenderer,
            node,
            nodeDndType,
            nodeTypeRole,
            childNodes,
            hasChildren,
            isLastChild,
            level,
            onNodeToggle,
            onNodeClick,
            onNodeFocus,
            onNodeDrag,
            onNodeEndDrag,
            onNodeDrop,
            currentlyDraggedNodes,
            isContentTreeNode,
            focusedNodesContextPaths,
            areFocusedNodesNestedInEachOther,
            isWorkspaceReadOnly
        } = this.props;

        if (!this.isVisible()) {
            return null;
        }
        const refHandler = div => {
            this.domNode = div;
        };
        const childNodesCount = childNodes.length;

        const labelIdentifier = (isContentTreeNode ? 'content-' : '') + 'treeitem-' + hashSum(node.contextPath) + '-label';

        const directLink = (isContentTreeNode ? undefined : this.createDirectNodeLink());

        const labelTitle = decodeLabel(node?.label) + ' (' + this.getNodeTypeLabel() + ')';

        // Autocreated or we have nested nodes and the node that we are dragging belongs to the selection
        // For read only workspaces we also forbid drag and drop
        const dragForbidden = isWorkspaceReadOnly || node.isAutoCreated || (areFocusedNodesNestedInEachOther && focusedNodesContextPaths.includes(node.contextPath));

        return (
            <Tree.Node aria-expanded={this.isCollapsed() ? 'false' : 'true'} aria-labelledby={labelIdentifier}>
                <span ref={refHandler}/>
                <Tree.Node.Header
                    labelIdentifier={labelIdentifier}
                    id={node.contextPath}
                    hasChildren={hasChildren}
                    nodeDndType={nodeDndType}
                    isLastChild={isLastChild}
                    isCollapsed={this.isCollapsed()}
                    isActive={this.isActive()}
                    isFocused={this.isFocused()}
                    isLoading={this.isLoading()}
                    isDirty={this.props.isNodeDirty}
                    isHidden={node?.properties?._hidden}
                    isHiddenInIndex={node?.properties?._hiddenInIndex || this.isIntermediate()}
                    isDragging={currentlyDraggedNodes.includes(node.contextPath)}
                    hasError={this.hasError()}
                    label={decodeLabel(node?.label)}
                    icon={this.getIcon()}
                    customIconComponent={this.getCustomIconComponent()}
                    iconLabel={this.getNodeTypeLabel()}
                    directLink={directLink}
                    level={level}
                    onToggle={this.handleNodeToggle}
                    onClick={this.handleNodeClick}
                    dragAndDropContext={this.getDragAndDropContext()}
                    dragForbidden={dragForbidden}
                    title={labelTitle}
                    />
                {this.isCollapsed() ? null : (
                    <Tree.Node.Contents>
                        {childNodes.filter(n => n).map((node, index) =>
                            <ChildRenderer
                                ChildRenderer={ChildRenderer}
                                key={node.contextPath}
                                node={node}
                                nodeDndType={nodeDndType}
                                nodeTypeRole={nodeTypeRole}
                                onNodeToggle={onNodeToggle}
                                onNodeClick={onNodeClick}
                                onNodeFocus={onNodeFocus}
                                onNodeDrag={onNodeDrag}
                                onNodeEndDrag={onNodeEndDrag}
                                onNodeDrop={onNodeDrop}
                                currentlyDraggedNodes={currentlyDraggedNodes}
                                isLastChild={index + 1 === childNodesCount}
                                level={level + 1}
                                />
                        )}
                    </Tree.Node.Contents>
                )}
            </Tree.Node>
        );
    }

    handleNodeToggle = () => {
        const {node, onNodeToggle} = this.props;
        onNodeToggle(node.contextPath);
    }

    handleNodeClick = e => {
        const {node, onNodeFocus, onNodeClick, isFocused, reload} = this.props;
        const metaKeyPressed = e.metaKey || e.ctrlKey;
        const shiftKeyPressed = e.shiftKey;
        const altKeyPressed = e.altKey;

        // Trigger reload if clicking on the current document node
        if (isFocused && reload) {
            reload();
        }

        // Append presetBaseNodeType param to src
        const srcWithBaseNodeType = this.props.filterNodeType ? urlWithParams(
            node?.uri,
            {presetBaseNodeType: this.props.filterNodeType}
        ) : node?.uri;

        onNodeFocus(node.contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed);
        onNodeClick(srcWithBaseNodeType, node.contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed);
    }

    createDirectNodeLink = () => {
        const {node} = this.props;
        const uri = new URL(window.location.href);
        uri.searchParams.set('node', node.contextPath);
        return uri.toString();
    }
}

const withNodeTypeRegistryAndI18nRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository'),
    i18nRegistry: globalRegistry.get('i18n')
}));

export const PageTreeNode = withNodeTypeRegistryAndI18nRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const allowedNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'));

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeMovedAlongsideSelector = selectors.CR.Nodes.makeCanBeMovedAlongsideSelector(nodeTypesRegistry);
        const canBeMovedIntoSelector = selectors.CR.Nodes.makeCanBeMovedIntoSelector(nodeTypesRegistry);
        const isDocumentNodeDirtySelector = selectors.CR.Workspaces.makeIsDocumentNodeDirtySelector();

        return (state, {node, currentlyDraggedNodes}) => {
            const canBeInsertedAlongside = currentlyDraggedNodes.every(draggedNodeContextPath => canBeMovedAlongsideSelector(state, {
                subject: draggedNodeContextPath,
                reference: getContextPath(node)
            }));
            const canBeInsertedInto = currentlyDraggedNodes.every(draggedNodeContextPath => canBeMovedIntoSelector(state, {
                subject: draggedNodeContextPath,
                reference: getContextPath(node)
            }));
            return ({
                isContentTreeNode: false,
                focusedNodesContextPaths: selectors.UI.PageTree.getAllFocused(state),
                areFocusedNodesNestedInEachOther: selectors.UI.PageTree.areFocusedNodesNestedInEachOther(state),
                rootNode: selectors.CR.Nodes.siteNodeSelector(state),
                loadingDepth: neos.configuration.nodeTree.loadingDepth,
                childNodes: childrenOfSelector(state, getContextPath(node)),
                hasChildren: hasChildrenSelector(state, getContextPath(node)),
                isActive: selectors.CR.Nodes.documentNodeContextPathSelector(state) === node.contextPath,
                isFocused: selectors.UI.PageTree.getAllFocused(state).includes(node.contextPath),
                toggledNodeContextPaths: selectors.UI.PageTree.getToggled(state),
                visibleContextPaths: selectors.UI.PageTree.getVisible(state),
                intermediateContextPaths: selectors.UI.PageTree.getIntermediate(state),
                loadingNodeContextPaths: selectors.UI.PageTree.getLoading(state),
                errorNodeContextPaths: selectors.UI.PageTree.getErrors(state),
                isNodeDirty: isDocumentNodeDirtySelector(state, node.contextPath),
                filterNodeType: state?.ui?.pageTree?.filterNodeType,
                canBeInsertedAlongside,
                canBeInsertedInto
            });
        };
    },
    {
        reload: actions.UI.ContentCanvas.reload
    }
)(Node));

export const ContentTreeNode = withNodeTypeRegistryAndI18nRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const allowedNodeTypes = [].concat(
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('content')),
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('contentCollection'))
        );

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeMovedAlongsideSelector = selectors.CR.Nodes.makeCanBeMovedAlongsideSelector(nodeTypesRegistry);
        const canBeMovedIntoSelector = selectors.CR.Nodes.makeCanBeMovedIntoSelector(nodeTypesRegistry);
        const isContentNodeDirtySelector = selectors.CR.Workspaces.makeIsContentNodeDirtySelector();

        return (state, {node, currentlyDraggedNodes}) => {
            const canBeInsertedAlongside = currentlyDraggedNodes.every(draggedNodeContextPath => canBeMovedAlongsideSelector(state, {
                subject: draggedNodeContextPath,
                reference: getContextPath(node)
            }));
            const canBeInsertedInto = currentlyDraggedNodes.every(draggedNodeContextPath => canBeMovedIntoSelector(state, {
                subject: draggedNodeContextPath,
                reference: getContextPath(node)
            }));
            return ({
                isContentTreeNode: true,
                focusedNodesContextPaths: selectors.UI.PageTree.getAllFocused(state),
                areFocusedNodesNestedInEachOther: selectors.UI.PageTree.areFocusedNodesNestedInEachOther(state),
                rootNode: selectors.CR.Nodes.documentNodeSelector(state),
                loadingDepth: neos.configuration.structureTree.loadingDepth,
                childNodes: childrenOfSelector(state, getContextPath(node)),
                hasChildren: hasChildrenSelector(state, getContextPath(node)),
                isActive: selectors.CR.Nodes.documentNodeContextPathSelector(state) === node.contextPath,
                isFocused: selectors.CR.Nodes.focusedNodePathsSelector(state).includes(node.contextPath),
                toggledNodeContextPaths: selectors.UI.ContentTree.getToggled(state),
                loadingNodeContextPaths: selectors.UI.ContentTree.getLoading(state),
                errorNodeContextPaths: selectors.UI.ContentTree.getErrors(state),
                isNodeDirty: isContentNodeDirtySelector(state, node.contextPath),
                canBeInsertedAlongside,
                canBeInsertedInto
            });
        };
    }
)(Node));
