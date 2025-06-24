import React, {useState, useCallback, useEffect, useRef} from 'react';
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

const NodeComponent = props => {
    const {
        isContentTreeNode,
        rootNode,
        loadingDepth,
        ChildRenderer,
        node,
        nodeDndType,
        nodeTypeRole,
        currentlyDraggedNodes,
        hasChildren,
        isLastChild,
        childNodes,
        level,
        isActive,
        isFocused,
        toggledNodeContextPaths,
        visibleContextPaths,
        intermediateContextPaths,
        loadingNodeContextPaths,
        errorNodeContextPaths,
        canBeInsertedAlongside,
        canBeInsertedInto,
        isNodeDirty,
        areFocusedNodesNestedInEachOther,
        isWorkspaceReadOnly,
        nodeTypesRegistry,
        i18nRegistry,
        onNodeToggle,
        onNodeClick,
        onNodeFocus,
        onNodeDrag,
        onNodeEndDrag,
        onNodeDrop,
        focusedNodesContextPaths,
        filterNodeType,
        reload
    } = props;

    const [shouldScrollIntoView, setShouldScrollIntoView] = useState(false);
    const domNodeRef = useRef(null);

    // Always request scroll on first render if given node is focused
    useEffect(() => {
        if (isFocused) {
            setShouldScrollIntoView(true);
        }
    }, [isFocused]);

    // Scroll focused node into view
    useEffect(() => {
        if (shouldScrollIntoView && domNodeRef.current) {
            const scrollingElement = findScrollingParent(domNodeRef.current);
            if (scrollingElement) {
                const nodeTopPosition = domNodeRef.current.getBoundingClientRect().top;
                const offset = 50;
                const scrollingElementPosition = scrollingElement.getBoundingClientRect();
                const nodeIsNotInView = nodeTopPosition < scrollingElementPosition.top + offset || nodeTopPosition > scrollingElementPosition.bottom - offset;
                if (nodeIsNotInView) {
                    scrollingElement.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'});
                }
                setShouldScrollIntoView(false);
            }
        }
    }, [shouldScrollIntoView]);

    const accepts = useCallback(mode => {
        const canBeInserted = mode === 'into' ? canBeInsertedInto : canBeInsertedAlongside;
        return currentlyDraggedNodes.length > 0 && canBeInserted && !currentlyDraggedNodes.includes(getContextPath(node));
    }, [node, currentlyDraggedNodes, canBeInsertedAlongside, canBeInsertedInto]);

    const handleNodeDrag = useCallback(() => {
        onNodeDrag(node);
    }, [node, onNodeDrag]);

    const handleNodeEndDrag = useCallback(() => {
        onNodeEndDrag(node);
    }, [node, onNodeEndDrag]);

    const handleNodeDrop = useCallback(position => {
        onNodeDrop(node, position);
    }, [node, onNodeDrop]);

    const getIcon = useCallback(() => {
        const nodeType = node?.nodeType;
        return nodeTypesRegistry.get(nodeType)?.ui?.icon;
    }, [node, nodeTypesRegistry]);

    /**
     * This function will render some additons to the nodetype icon
     * if the page is (currently) hidden
     */
    const getCustomIconComponent = useCallback(() => {
        const isDisabled = node?.properties?._hidden;
        const hasTimeableNodeVisibility = node?.properties?._hasTimeableNodeVisibility;

        if (hasTimeableNodeVisibility) {
            const circleColor = isDisabled ? 'error' : 'primaryBlue';

            return (
                <span className="fa-layers fa-fw">
                    <Icon icon={getIcon()} />
                    <Icon icon="circle" color={circleColor} transform="shrink-5 down-6 right-4" />
                    <Icon icon="clock" transform="shrink-9 down-6 right-4" />
                </span>
            );
        }
        if (isDisabled) {
            return (
                <span className="fa-layers fa-fw">
                    <Icon icon={getIcon()} />
                    <Icon icon="circle" color="error" transform="shrink-3 down-6 right-4" />
                    <Icon icon="times" transform="shrink-7 down-6 right-4" />
                </span>
            );
        }

        return null;
    }, [node, getIcon]);

    const getNodeTypeLabel = useCallback(() => {
        const nodeType = node?.nodeType;
        const nodeTypeLabel = nodeTypesRegistry.get(nodeType)?.ui?.label;
        return i18nRegistry.translate(nodeTypeLabel, nodeTypeLabel);
    }, [node, nodeTypesRegistry, i18nRegistry]);

    const isFocusedNode = useCallback(() => {
        return isFocused;
    }, [isFocused]);

    const isActiveNode = useCallback(() => {
        if (isContentTreeNode) {
            return isFocusedNode();
        }
        return isActive;
    }, [isActive, isContentTreeNode, isFocusedNode]);

    const isCollapsedNode = useCallback(() => {
        const isToggled = toggledNodeContextPaths.includes(node.contextPath);
        return isNodeCollapsed(node, isToggled, rootNode, loadingDepth);
    }, [node, toggledNodeContextPaths, rootNode, loadingDepth]);

    const isVisibleNode = useCallback(() => {
        return !Array.isArray(visibleContextPaths) || visibleContextPaths.includes(node.contextPath);
    }, [node, visibleContextPaths]);

    const isIntermediateNode = useCallback(() => {
        return intermediateContextPaths && intermediateContextPaths.includes(node.contextPath);
    }, [node, intermediateContextPaths]);

    const isLoadingNode = useCallback(() => {
        return loadingNodeContextPaths ? loadingNodeContextPaths.includes(node.contextPath) : false;
    }, [node, loadingNodeContextPaths]);

    const hasErrorNode = useCallback(() => {
        return errorNodeContextPaths ? errorNodeContextPaths.includes(node.contextPath) : false;
    }, [node, errorNodeContextPaths]);

    const getDragAndDropContext = useCallback(() => {
        return {
            onDrag: handleNodeDrag,
            onEndDrag: handleNodeEndDrag,
            onDrop: handleNodeDrop,
            accepts
        };
    }, [handleNodeDrag, handleNodeEndDrag, handleNodeDrop, accepts]);

    const handleNodeToggleClick = useCallback(() => {
        onNodeToggle(node.contextPath);
    }, [node, onNodeToggle]);

    const handleNodeClickEvent = useCallback(e => {
        const metaKeyPressed = e.metaKey || e.ctrlKey;
        const shiftKeyPressed = e.shiftKey;
        const altKeyPressed = e.altKey;

        // Trigger reload if clicking on the current document node
        if (isFocused && reload) {
            reload();
        }

        // Append presetBaseNodeType param to src
        const srcWithBaseNodeType = filterNodeType ? urlWithParams(
            node?.uri,
            {presetBaseNodeType: filterNodeType}
        ) : node?.uri;

        onNodeFocus(node.contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed);
        onNodeClick(srcWithBaseNodeType, node.contextPath, metaKeyPressed, altKeyPressed, shiftKeyPressed);
    }, [node, onNodeFocus, onNodeClick, isFocused, reload, filterNodeType]);

    const createDirectNodeLink = useCallback(() => {
        const uri = new URL(window.location.href);
        uri.searchParams.set('node', node.contextPath);
        return uri.toString();
    }, [node]);

    if (!isVisibleNode()) {
        return null;
    }

    const childNodesCount = childNodes.length;
    const labelIdentifier = (isContentTreeNode ? 'content-' : '') + 'treeitem-' + hashSum(node.contextPath) + '-label';
    const directLink = (isContentTreeNode ? undefined : createDirectNodeLink());
    const labelTitle = decodeLabel(node?.label) + ' (' + getNodeTypeLabel() + ')';

    // Autocreated or we have nested nodes and the node that we are dragging belongs to the selection
    // For read only workspaces we also forbid drag and drop
    const dragForbidden = isWorkspaceReadOnly || node.isAutoCreated || (areFocusedNodesNestedInEachOther && focusedNodesContextPaths.includes(node.contextPath));

    return (
        <Tree.Node aria-expanded={isCollapsedNode() ? 'false' : 'true'} aria-labelledby={labelIdentifier}>
            <span ref={domNodeRef}/>
            <Tree.Node.Header
                labelIdentifier={labelIdentifier}
                id={node.contextPath}
                hasChildren={hasChildren}
                nodeDndType={nodeDndType}
                isLastChild={isLastChild}
                isCollapsed={isCollapsedNode()}
                isActive={isActiveNode()}
                isFocused={isFocusedNode()}
                isLoading={isLoadingNode()}
                isDirty={isNodeDirty}
                isHidden={node?.properties?._hidden}
                isHiddenInIndex={node?.properties?._hiddenInIndex || isIntermediateNode()}
                isDragging={currentlyDraggedNodes.includes(node.contextPath)}
                hasError={hasErrorNode()}
                label={decodeLabel(node?.label)}
                icon={getIcon()}
                customIconComponent={getCustomIconComponent()}
                iconLabel={getNodeTypeLabel()}
                directLink={directLink}
                level={level}
                onToggle={handleNodeToggleClick}
                onClick={handleNodeClickEvent}
                dragAndDropContext={getDragAndDropContext()}
                dragForbidden={dragForbidden}
                title={labelTitle}
                />
            {isCollapsedNode() ? null : (
                <Tree.Node.Contents>
                    {childNodes.filter(n => n).map((childNode, index) =>
                        <ChildRenderer
                            ChildRenderer={ChildRenderer}
                            key={childNode.contextPath}
                            node={childNode}
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
};

NodeComponent.propTypes = {
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
    onNodeDrop: PropTypes.func,
    focusedNodesContextPaths: PropTypes.array,
    filterNodeType: PropTypes.string,
    reload: PropTypes.func
};

const Node = connect(
    state => ({
        isWorkspaceReadOnly: selectors.CR.Workspaces.isWorkspaceReadOnlySelector(state)
    })
)(NodeComponent);

export default Node;

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
