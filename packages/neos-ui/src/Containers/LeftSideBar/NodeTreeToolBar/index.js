import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $contains} from 'plow-js';

import {isEqualSet} from '@neos-project/utils-helpers';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {hasNestedNodes} from '@neos-project/neos-ui/src/Containers/LeftSideBar/NodeTree/helpers';
import {InsertPosition} from '@neos-project/neos-ts-interfaces';

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
        copyNodes: PropTypes.func.isRequired,
        cutNodes: PropTypes.func.isRequired,
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
        const {addNode, treeType} = this.props;

        addNode(contextPath, undefined, treeType === 'PageTree' ? InsertPosition.AFTER : InsertPosition.INTO);
    }

    handleHideNode = () => {
        const {hideNodes, canBeEdited, visibilityCanBeToggled, focusedNodesContextPaths} = this.props;
        if (canBeEdited && visibilityCanBeToggled) {
            hideNodes(focusedNodesContextPaths);
        }
    }

    handleShowNode = () => {
        const {showNodes, canBeEdited, visibilityCanBeToggled, focusedNodesContextPaths} = this.props;

        if (canBeEdited && visibilityCanBeToggled) {
            showNodes(focusedNodesContextPaths);
        }
    }

    handleCopyNodes = () => {
        const {copyNodes, focusedNodesContextPaths} = this.props;

        copyNodes(focusedNodesContextPaths);
    }

    handleCutNodes = () => {
        const {cutNodes, canBeEdited, focusedNodesContextPaths} = this.props;

        if (canBeEdited) {
            cutNodes(focusedNodesContextPaths);
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

        reloadTree({merge: true});
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
                            onClick={this.handleCopyNodes}
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
                            onClick={this.handleCutNodes}
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

const makeMapStateToProps = isDocument => (state, {nodeTypesRegistry}) => {
    const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);
    const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = isDocument ? selectors.UI.PageTree.getFocused(state) : selectors.CR.Nodes.focusedNodePathSelector(state);
        const focusedNodesContextPaths = isDocument ? selectors.UI.PageTree.getAllFocused(state) : selectors.CR.Nodes.focusedNodePathsSelector(state);

        const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
        const focusedNode = getNodeByContextPathSelector(state);
        const clipboardNodesContextPaths = selectors.CR.Nodes.clipboardNodesContextPathsSelector(state);
        const canBePasted = clipboardNodesContextPaths.every(clipboardNodeContextPath => {
            return canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });
        });

        const selectionHasNestedNodes = hasNestedNodes(focusedNodesContextPaths);

        const canBeDeleted = (removeAllowed(focusedNodesContextPaths, state) && !selectionHasNestedNodes) || false;
        const visibilityCanBeToggled = visibilityToggleAllowed(focusedNodesContextPaths, state);
        const canBeEdited = editingAllowed(focusedNodesContextPaths, state);

        const clipboardMode = $get('cr.nodes.clipboardMode', state);
        const allFocusedNodesAreInClipboard = isEqualSet(focusedNodesContextPaths, clipboardNodesContextPaths);
        const isCut = allFocusedNodesAreInClipboard && clipboardMode === 'Move';
        const isCopied = allFocusedNodesAreInClipboard && clipboardMode === 'Copy';

        const isHidden = $get('properties._hidden', focusedNode);

        const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
            reference: focusedNodeContextPath
        });
        const isHiddenContentTree = $get('ui.leftSideBar.contentTree.isHidden', state);

        const destructiveOperationsAreDisabled = (
            isDocument ?
            selectors.UI.PageTree.destructiveOperationsAreDisabledForPageTreeSelector(state) :
            selectors.CR.Nodes.destructiveOperationsAreDisabledForContentTreeSelector(state)
        ) || selectionHasNestedNodes;
        const isLoading = isDocument ? selectors.UI.PageTree.getIsLoading(state) : selectors.UI.ContentTree.getIsLoading(state);

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
            isHiddenContentTree,
            treeType: isDocument ? 'PageTree' : 'ContentTree',
            displayToggleContentTreeButton: !isDocument
        };
    };
};

export const PageTreeToolbar = withNodeTypesRegistry(connect(
    makeMapStateToProps(true), {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNodes: actions.CR.Nodes.copyMultiple,
        cutNodes: actions.CR.Nodes.cutMultiple,
        deleteNodes: actions.CR.Nodes.commenceRemovalMultiple,
        hideNode: actions.CR.Nodes.hide,
        hideNodes: actions.CR.Nodes.hideMultiple,
        showNode: actions.CR.Nodes.show,
        showNodes: actions.CR.Nodes.showMultiple,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.CR.Nodes.reloadState
    }
)(NodeTreeToolBar));

export const ContentTreeToolbar = withNodeTypesRegistry(connect(
    makeMapStateToProps(false), {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNodes: actions.CR.Nodes.copyMultiple,
        cutNodes: actions.CR.Nodes.cutMultiple,
        deleteNodes: actions.CR.Nodes.commenceRemovalMultiple,
        hideNode: actions.CR.Nodes.hide,
        hideNodes: actions.CR.Nodes.hideMultiple,
        showNode: actions.CR.Nodes.show,
        showNodes: actions.CR.Nodes.showMultiple,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.UI.ContentTree.reloadTree,
        toggleContentTree: actions.UI.LeftSideBar.toggleContentTree
    }
)(NodeTreeToolBar));
