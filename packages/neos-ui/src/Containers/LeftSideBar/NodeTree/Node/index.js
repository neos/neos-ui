import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {$get} from 'plow-js';
import {connect} from 'react-redux';

import flowright from 'lodash.flowright';
import Tree from '@neos-project/react-ui-components/src/Tree/';
import {stripTags, decodeHtml} from '@neos-project/utils-helpers';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {isNodeCollapsed} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';
import {neos} from '@neos-project/neos-ui-decorators';
import animate from 'amator';

const getContextPath = $get('contextPath');

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

export default class Node extends PureComponent {
    static propTypes = {
        isContentTreeNode: PropTypes.bool,
        rootNode: PropTypes.object,
        loadingDepth: PropTypes.number,
        ChildRenderer: PropTypes.func.isRequired,
        node: PropTypes.object,
        nodeDndType: PropTypes.string.isRequired,
        nodeTypeRole: PropTypes.string,
        currentlyDraggedNode: PropTypes.object,
        hasChildren: PropTypes.bool,
        isLastChild: PropTypes.bool,
        childNodes: PropTypes.object,
        currentDocumentNodeContextPath: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,
        toggledNodeContextPaths: PropTypes.object,
        hiddenContextPaths: PropTypes.object,
        intermediateContextPaths: PropTypes.object,
        loadingNodeContextPaths: PropTypes.object,
        errorNodeContextPaths: PropTypes.object,
        canBeInsertedAlongside: PropTypes.bool,
        canBeInsertedInto: PropTypes.bool,
        isNodeDirty: PropTypes.bool.isRequired,

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

        this.state = {
            shouldScrollIntoView: false
        };

        this.handleNodeToggle = this.handleNodeToggle.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    componentDidMount() {
        // Always request scroll on first render if given node is focused
        if (this.props.focusedNodeContextPath === $get('contextPath', this.props.node)) {
            this.setState({
                shouldScrollIntoView: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // If focused node changed
        if (this.props.focusedNodeContextPath !== nextProps.focusedNodeContextPath) {
            // And it is the current node
            if (nextProps.focusedNodeContextPath === $get('contextPath', nextProps.node)) {
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
                    const scrollTop = nodeTopPosition - scrollingElement.firstElementChild.getBoundingClientRect().top - offset;
                    animate({scrollTop: scrollingElement.scrollTop}, {scrollTop}, {
                        step: ({scrollTop}) => {
                            scrollingElement.scrollTop = scrollTop;
                        }
                    });
                }
                this.setState({
                    shouldScrollIntoView: false
                });
            }
        }
    }

    accepts = mode => {
        const {node, currentlyDraggedNode, canBeInsertedAlongside, canBeInsertedInto} = this.props;
        const canBeInserted = mode === 'into' ? canBeInsertedInto : canBeInsertedAlongside;

        return canBeInserted && (getContextPath(currentlyDraggedNode) !== getContextPath(node));
    }

    handleNodeDrag = () => {
        const {node, onNodeDrag} = this.props;

        onNodeDrag(node);
    }

    handleNodeDrop = position => {
        const {node, onNodeDrop} = this.props;

        onNodeDrop(node, position);
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
        const {node, currentDocumentNodeContextPath, isContentTreeNode} = this.props;
        if (isContentTreeNode) {
            return this.isFocused();
        }
        return currentDocumentNodeContextPath === $get('contextPath', node);
    }

    isCollapsed() {
        const {node, toggledNodeContextPaths, rootNode, loadingDepth} = this.props;

        const isToggled = toggledNodeContextPaths.includes($get('contextPath', node));
        return isNodeCollapsed(node, isToggled, rootNode, loadingDepth);
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
            nodeDndType,
            nodeTypeRole,
            childNodes,
            hasChildren,
            isLastChild,
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
        const refHandler = div => {
            this.domNode = div;
        };
        const childNodesCount = childNodes.count();

        return (
            <Tree.Node>
                <span ref={refHandler}/>
                <Tree.Node.Header
                    id={$get('contextPath', node)}
                    hasChildren={hasChildren}
                    nodeDndType={nodeDndType}
                    isLastChild={isLastChild}
                    isCollapsed={this.isCollapsed()}
                    isActive={this.isActive()}
                    isFocused={this.isFocused()}
                    isLoading={this.isLoading()}
                    isDirty={this.props.isNodeDirty}
                    isHidden={$get('properties._hidden', node)}
                    isHiddenInIndex={$get('properties._hiddenInIndex', node) || this.isIntermediate()}
                    hasError={this.hasError()}
                    label={decodeLabel($get('label', node))}
                    icon={this.getIcon()}
                    onToggle={this.handleNodeToggle}
                    onClick={this.handleNodeClick}
                    dragAndDropContext={this.getDragAndDropContext()}
                    />
                {this.isCollapsed() ? null : (
                    <Tree.Node.Contents>
                        {childNodes.filter(n => n).map((node, index) =>
                            <ChildRenderer
                                ChildRenderer={ChildRenderer}
                                key={$get('contextPath', node)}
                                node={node}
                                nodeDndType={nodeDndType}
                                nodeTypeRole={nodeTypeRole}
                                onNodeToggle={onNodeToggle}
                                onNodeClick={onNodeClick}
                                onNodeFocus={onNodeFocus}
                                onNodeDrag={onNodeDrag}
                                onNodeDrop={onNodeDrop}
                                currentlyDraggedNode={currentlyDraggedNode}
                                isLastChild={index + 1 === childNodesCount}
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
}

const withNodeTypeRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

export const PageTreeNode = withNodeTypeRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const allowedNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'));

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
        const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeInsertedIntoSelector(nodeTypesRegistry);
        const isDocumentNodeDirtySelector = selectors.CR.Workspaces.makeIsDocumentNodeDirtySelector();

        return (state, {node, currentlyDraggedNode}) => ({
            isContentTreeNode: false,
            rootNode: selectors.CR.Nodes.siteNodeSelector(state),
            loadingDepth: neos.configuration.nodeTree.loadingDepth,
            childNodes: childrenOfSelector(state, getContextPath(node)),
            hasChildren: hasChildrenSelector(state, getContextPath(node)),
            currentDocumentNodeContextPath: selectors.UI.ContentCanvas.getCurrentContentCanvasContextPath(state),
            currentDocumentNode: selectors.UI.ContentCanvas.documentNodeSelector(state),
            focusedNodeContextPath: selectors.UI.PageTree.getFocused(state),
            toggledNodeContextPaths: selectors.UI.PageTree.getToggled(state),
            hiddenContextPaths: selectors.UI.PageTree.getHidden(state),
            intermediateContextPaths: selectors.UI.PageTree.getIntermediate(state),
            loadingNodeContextPaths: selectors.UI.PageTree.getLoading(state),
            errorNodeContextPaths: selectors.UI.PageTree.getErrors(state),
            isNodeDirty: isDocumentNodeDirtySelector(state, $get('contextPath', node)),
            canBeInsertedAlongside: canBeInsertedAlongsideSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            }),
            canBeInsertedInto: canBeInsertedIntoSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            })
        });
    }, {
        onNodeFocus: actions.UI.PageTree.focus
    }
)(Node));

export const ContentTreeNode = withNodeTypeRegistry(connect(
    (state, {neos, nodeTypesRegistry}) => {
        const allowedNodeTypes = [].concat(
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('content')),
            nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('contentCollection'))
        );

        const childrenOfSelector = selectors.CR.Nodes.makeChildrenOfSelector(allowedNodeTypes);
        const hasChildrenSelector = selectors.CR.Nodes.makeHasChildrenSelector(allowedNodeTypes);
        const canBeInsertedAlongsideSelector = selectors.CR.Nodes.makeCanBeInsertedAlongsideSelector(nodeTypesRegistry);
        const canBeInsertedIntoSelector = selectors.CR.Nodes.makeCanBeInsertedIntoSelector(nodeTypesRegistry);
        const isContentNodeDirtySelector = selectors.CR.Workspaces.makeIsContentNodeDirtySelector();

        return (state, {node, currentlyDraggedNode}) => ({
            isContentTreeNode: true,
            rootNode: selectors.UI.ContentCanvas.documentNodeSelector(state),
            loadingDepth: neos.configuration.structureTree.loadingDepth,
            childNodes: childrenOfSelector(state, getContextPath(node)),
            hasChildren: hasChildrenSelector(state, getContextPath(node)),
            currentDocumentNodeContextPath: selectors.UI.ContentCanvas.getCurrentContentCanvasContextPath(state),
            currentDocumentNode: selectors.UI.ContentCanvas.documentNodeSelector(state),
            focusedNodeContextPath: $get('cr.nodes.focused.contextPath', state),
            toggledNodeContextPaths: selectors.UI.ContentTree.getToggled(state),
            isNodeDirty: isContentNodeDirtySelector(state, $get('contextPath', node)),
            canBeInsertedAlongside: canBeInsertedAlongsideSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            }),
            canBeInsertedInto: canBeInsertedIntoSelector(state, {
                subject: getContextPath(currentlyDraggedNode),
                reference: getContextPath(node)
            })
        });
    }, {
        onNodeFocus: actions.CR.Nodes.focus
    }
)(Node));
