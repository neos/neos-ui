import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $contains} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode,
    RefreshPageTree,
    ToggleContentTree
} from './Buttons/index';
import style from './style.css';

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class NodeTreeToolBar extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        displayToggleContentTreeButton: PropTypes.bool,
        focusedNodeContextPath: PropTypes.string,
        canBePasted: PropTypes.bool.isRequired,
        canBeDeleted: PropTypes.bool.isRequired,
        canBeEdited: PropTypes.bool.isRequired,
        visibilityCanBeToggled: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,
        isCut: PropTypes.bool.isRequired,
        isCopied: PropTypes.bool.isRequired,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool.isRequired,
        isHiddenContentTree: PropTypes.bool,
        treeType: PropTypes.string.isRequired,

        addNode: PropTypes.func.isRequired,
        copyNode: PropTypes.func.isRequired,
        cutNode: PropTypes.func.isRequired,
        deleteNodes: PropTypes.func.isRequired,
        hideNode: PropTypes.func.isRequired,
        showNode: PropTypes.func.isRequired,
        pasteNode: PropTypes.func.isRequired,
        reloadTree: PropTypes.func.isRequired,
        toggleContentTree: PropTypes.func
    }

    static defaultProps = {
        isHidden: false
    };

    handleAddNode = contextPath => {
        const {addNode} = this.props;

        addNode(contextPath);
    }

    handleHideNode = () => {
        const {hideMultipleNodes, canBeEdited, visibilityCanBeToggled, focusedNodesContextPaths} = this.props;
        if (canBeEdited && visibilityCanBeToggled) {
            hideMultipleNodes(focusedNodesContextPaths);
        }
    }

    handleShowNode = () => {
        const {showMultipleNodes, canBeEdited, visibilityCanBeToggled, focusedNodesContextPaths} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            showMultipleNodes(focusedNodesContextPaths);
        }
    }

    handleCopyNode = contextPath => {
        const {copyNode} = this.props;

        copyNode(contextPath);
    }

    handleCutNode = contextPath => {
        const {cutNode, canBeEdited} = this.props;

        if (canBeEdited) {
            cutNode(contextPath);
        }
    }

    handlePasteNode = contextPath => {
        const {pasteNode} = this.props;

        pasteNode(contextPath);
    }

    handleDeleteNodes = () => {
        const {deleteNodes, canBeDeleted, canBeEdited, focusedNodesContextPaths} = this.props;

        if (canBeDeleted && canBeEdited) {
            deleteNodes(focusedNodesContextPaths);
        }
    }

    handleReloadTree = () => {
        const {reloadTree} = this.props;

        reloadTree();
    }

    handleToggleContentTree = () => {
        const {toggleContentTree} = this.props;

        toggleContentTree();
    }

    render() {
        const {
            focusedNodeContextPath,
            displayToggleContentTreeButton,
            canBePasted,
            canBeDeleted,
            canBeEdited,
            visibilityCanBeToggled,
            isHidden,
            isCut,
            isCopied,
            isLoading,
            destructiveOperationsAreDisabled,
            isAllowedToAddChildOrSiblingNodes,
            i18nRegistry,
            isHiddenContentTree,
            treeType
        } = this.props;

        return (
            <div>
                {Boolean(displayToggleContentTreeButton) && (
                    <div className={style.header}>
                        <ToggleContentTree
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            isPanelOpen={!isHiddenContentTree}
                            onClick={this.handleToggleContentTree}
                            id={`neos-${treeType}-ToggleContentTree`}
                        />
                    </div>
                )}
                <div className={style.toolBar}>
                    <div className={style.toolBar__btnGroup}>
                        <AddNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            disabled={!isAllowedToAddChildOrSiblingNodes}
                            onClick={this.handleAddNode}
                            id={`neos-${treeType}-AddNode`}
                            />
                        <HideSelectedNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            disabled={destructiveOperationsAreDisabled || !canBeEdited || !visibilityCanBeToggled}
                            isHidden={isHidden}
                            onClick={isHidden ? this.handleShowNode : this.handleHideNode}
                            id={`neos-${treeType}-HideSelectedNode`}
                            />
                        <CopySelectedNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            onClick={this.handleCopyNode}
                            isActive={isCopied}
                            disabled={destructiveOperationsAreDisabled || !canBeEdited}
                            id={`neos-${treeType}-CopySelectedNode`}
                            />
                        <CutSelectedNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            isActive={isCut}
                            disabled={destructiveOperationsAreDisabled || !canBeEdited}
                            onClick={this.handleCutNode}
                            id={`neos-${treeType}-CutSelectedNode`}
                            />
                        <PasteClipBoardNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            disabled={!canBePasted}
                            onClick={this.handlePasteNode}
                            id={`neos-${treeType}-PasteClipBoardNode`}
                            />
                        <DeleteSelectedNode
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            disabled={destructiveOperationsAreDisabled || !canBeDeleted || !canBeEdited}
                            onClick={this.handleDeleteNodes}
                            id={`neos-${treeType}-DeleteSelectedNode`}
                            />
                        <RefreshPageTree
                            i18nRegistry={i18nRegistry}
                            className={style.toolBar__btnGroup__btn}
                            focusedNodeContextPath={focusedNodeContextPath}
                            isLoading={isLoading}
                            onClick={this.handleReloadTree}
                            id={`neos-${treeType}-RefreshPageTree`}
                            />
                    </div>
                </div>
            </div>
        );
    }
}

const withNodeTypesRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

const hasNestedNodes = focusedNodesContextPaths => {
    return focusedNodesContextPaths.every(contextPathA => {
        const path = contextPathA.split('@')[0];
        // TODO: adjust this for the new CR when this is merged: https://github.com/neos/neos-ui/pull/2178
        return focusedNodesContextPaths.every(contextPathB => !(contextPathB.indexOf(path) === 0 && contextPathA != contextPathB));
    });
};

const removeAllowed = (focusedNodesContextPaths, state) => focusedNodesContextPaths.every(contextPath => {
    const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath);
    const focusedNode = getNodeByContextPathSelector(state);
    return $get('policy.canRemove', focusedNode);
});
const visibilityToggleAllowed = (focusedNodesContextPaths, state) => focusedNodesContextPaths.every(contextPath => {
    const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath);
    const focusedNode = getNodeByContextPathSelector(state);
    return !$contains('_hidden', 'policy.disallowedProperties', focusedNode);
});
const editingAllowed = (focusedNodesContextPaths, state) => focusedNodesContextPaths.every(contextPath => {
    const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath);
    const focusedNode = getNodeByContextPathSelector(state);
    return !$contains('_hidden', 'policy.disallowedProperties', focusedNode);
});

export const PageTreeToolbar = withNodeTypesRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);
        const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

        return state => {
            const focusedNodeContextPath = selectors.UI.PageTree.getFocused(state);
            const focusedNodesContextPaths = selectors.UI.PageTree.getAllFocused(state);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
            const focusedNode = getNodeByContextPathSelector(state);
            const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
            const canBePasted = canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });

            const selectionHasNestedNodes = hasNestedNodes(focusedNodesContextPaths);

            const canBeDeleted = (removeAllowed(focusedNodesContextPaths, state) && !selectionHasNestedNodes) || false;
            const visibilityCanBeToggled = visibilityToggleAllowed(focusedNodesContextPaths, state);
            const canBeEdited = editingAllowed(focusedNodesContextPaths, state);

            const clipboardMode = $get('cr.nodes.clipboardMode', state);
            const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
            const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
            const isLoading = selectors.UI.PageTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = selectors.UI.PageTree.destructiveOperationsAreDisabledForPageTreeSelector(state)
            const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
                reference: focusedNodeContextPath
            });

            return {
                focusedNodeContextPath,
                focusedNodesContextPaths,
                canBePasted,
                canBeDeleted,
                canBeEdited,
                visibilityCanBeToggled,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled,
                isAllowedToAddChildOrSiblingNodes,
                isCut,
                isCopied,
                treeType: 'PageTree'
            };
        };
    }, {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNode: actions.CR.Nodes.copy,
        cutNode: actions.CR.Nodes.cut,
        deleteNodes: actions.CR.Nodes.commenceRemovalMultiple,
        hideNode: actions.CR.Nodes.hide,
        hideMultipleNodes: actions.CR.Nodes.hideMultiple,
        showNode: actions.CR.Nodes.show,
        showMultipleNodes: actions.CR.Nodes.showMultiple,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.CR.Nodes.reloadState
    }
)(NodeTreeToolBar));

export const ContentTreeToolbar = withNodeTypesRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);
        const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

        return state => {
            const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
            const focusedNodesContextPaths = selectors.CR.Nodes.focusedNodePathsSelector(state);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
            const focusedNode = getNodeByContextPathSelector(state);
            const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
            const canBePasted = canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });

            const selectionHasNestedNodes = hasNestedNodes(focusedNodesContextPaths);

            const canBeDeleted = (removeAllowed(focusedNodesContextPaths, state) && !selectionHasNestedNodes) || false;
            const visibilityCanBeToggled = visibilityToggleAllowed(focusedNodesContextPaths, state);
            const canBeEdited = editingAllowed(focusedNodesContextPaths, state);

            const clipboardMode = $get('cr.nodes.clipboardMode', state);
            const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
            const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
            const isLoading = selectors.UI.ContentTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = selectors.CR.Nodes.destructiveOperationsAreDisabledForContentTreeSelector(state);

            const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
                reference: focusedNodeContextPath
            });
            const isHiddenContentTree = $get('ui.leftSideBar.contentTree.isHidden', state);

            return {
                focusedNodeContextPath,
                focusedNodesContextPaths,
                displayToggleContentTreeButton: true,
                canBePasted,
                canBeDeleted,
                canBeEdited,
                visibilityCanBeToggled,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled,
                isAllowedToAddChildOrSiblingNodes,
                isCut,
                isCopied,
                isHiddenContentTree,
                treeType: 'ContentTree'
            };
        };
    }, {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNode: actions.CR.Nodes.copy,
        cutNode: actions.CR.Nodes.cut,
        deleteNodes: actions.CR.Nodes.commenceRemovalMultiple,
        hideNode: actions.CR.Nodes.hide,
        hideMultipleNodes: actions.CR.Nodes.hideMultiple,
        showNode: actions.CR.Nodes.show,
        showMultipleNodes: actions.CR.Nodes.showMultiple,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.UI.ContentTree.reloadTree,
        toggleContentTree: actions.UI.LeftSideBar.toggleContentTree
    }
)(NodeTreeToolBar));
