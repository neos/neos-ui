import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {neos} from '@neos-project/neos-ui-decorators';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';

import {
    AddNode,
    CopySelectedNode,
    CutSelectedNode,
    DeleteSelectedNode,
    HideSelectedNode,
    PasteClipBoardNode,
    RefreshPageTree
} from './Buttons/index';
import style from './style.css';

export default class NodeTreeToolBar extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,
        focusedNodeContextPath: PropTypes.string,
        canBePasted: PropTypes.bool.isRequired,
        canBeDeleted: PropTypes.bool.isRequired,
        canBeEdited: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,
        isCut: PropTypes.bool.isRequired,
        isCopied: PropTypes.bool.isRequired,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool.isRequired,

        addNode: PropTypes.func.isRequired,
        copyNode: PropTypes.func.isRequired,
        cutNode: PropTypes.func.isRequired,
        deleteNode: PropTypes.func.isRequired,
        hideNode: PropTypes.func.isRequired,
        showNode: PropTypes.func.isRequired,
        pasteNode: PropTypes.func.isRequired,
        reloadTree: PropTypes.func.isRequired
    }

    static defaultProps = {
        isHidden: false
    };

    handleAddNode = contextPath => {
        const {addNode, canBeEdited} = this.props;

        if (canBeEdited) {
            addNode(contextPath);
        }
    }

    handleHideNode = contextPath => {
        const {hideNode, canBeEdited} = this.props;

        if (canBeEdited) {
            hideNode(contextPath);
        }
    }

    handleShowNode = contextPath => {
        const {showNode, canBeEdited} = this.props;

        if (canBeEdited) {
            showNode(contextPath);
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
        const {pasteNode, canBeEdited} = this.props;

        if (canBeEdited) {
            pasteNode(contextPath);
        }
    }

    handleDeleteNode = contextPath => {
        const {deleteNode, canBeDeleted, canBeEdited} = this.props;

        if (canBeDeleted && canBeEdited) {
            deleteNode(contextPath);
        }
    }

    handleReloadTree = () => {
        const {reloadTree} = this.props;

        reloadTree();
    }

    render() {
        const {
            focusedNodeContextPath,
            canBePasted,
            canBeDeleted,
            canBeEdited,
            isHidden,
            isCut,
            isCopied,
            isLoading,
            destructiveOperationsAreDisabled,
            isAllowedToAddChildOrSiblingNodes
        } = this.props;

        return (
            <div className={style.toolBar}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={!isAllowedToAddChildOrSiblingNodes || !canBeEdited}
                        onClick={this.handleAddNode}
                        />
                    <HideSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={destructiveOperationsAreDisabled || !canBeEdited}
                        isHidden={isHidden}
                        onHide={this.handleHideNode}
                        onShow={this.handleShowNode}
                        />
                    <CopySelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        onClick={this.handleCopyNode}
                        isActive={isCopied}
                        isDisabled={destructiveOperationsAreDisabled}
                        />
                    <CutSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isActive={isCut}
                        isDisabled={destructiveOperationsAreDisabled || !canBeEdited}
                        onClick={this.handleCutNode}
                        />
                    <PasteClipBoardNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={!canBePasted || !canBeEdited}
                        onClick={this.handlePasteNode}
                        />
                    <DeleteSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={destructiveOperationsAreDisabled || !canBeDeleted || !canBeEdited}
                        onClick={this.handleDeleteNode}
                        />
                    <RefreshPageTree
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isLoading={isLoading}
                        onClick={this.handleReloadTree}
                        />
                </div>
            </div>
        );
    }
}

const withNodeTypesRegistry = neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}));

export const PageTreeToolbar = withNodeTypesRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);
        const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

        return state => {
            const siteNodeContextPath = $get('cr.nodes.siteNode', state);
            const focusedNodeContextPath = selectors.UI.PageTree.getFocused(state);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
            const focusedNode = getNodeByContextPathSelector(state);
            const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
            const canBePasted = canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });
            const canBeDeleted = $get('policy.canRemove', focusedNode);
            const canBeEdited = $get('policy.canEdit', focusedNode);
            const clipboardMode = $get('cr.nodes.clipboardMode', state);
            const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
            const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
            const isLoading = selectors.UI.PageTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = (
                Boolean(focusedNode) === false ||
                $get('isAutoCreated', focusedNode) ||
                siteNodeContextPath === focusedNodeContextPath
            );
            const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
                reference: focusedNodeContextPath
            });

            return {
                focusedNodeContextPath,
                canBePasted,
                canBeDeleted,
                canBeEdited,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled,
                isAllowedToAddChildOrSiblingNodes,
                isCut,
                isCopied
            };
        };
    }, {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNode: actions.CR.Nodes.copy,
        cutNode: actions.CR.Nodes.cut,
        deleteNode: actions.CR.Nodes.commenceRemoval,
        hideNode: actions.CR.Nodes.hide,
        showNode: actions.CR.Nodes.show,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.UI.PageTree.reloadTree
    }
)(NodeTreeToolBar));

export const ContentTreeToolbar = withNodeTypesRegistry(connect(
    (state, {nodeTypesRegistry}) => {
        const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);
        const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

        return state => {
            const focusedNodeContextPath = $get('cr.nodes.focused.contextPath', state);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
            const focusedNode = getNodeByContextPathSelector(state);
            const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
            const canBePasted = canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });
            const canBeDeleted = $get('policy.canRemove', focusedNode);
            const canBeEdited = $get('policy.canEdit', focusedNode);
            const clipboardMode = $get('cr.nodes.clipboardMode', state);
            const isCut = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Move';
            const isCopied = focusedNodeContextPath === clipboardNodeContextPath && clipboardMode === 'Copy';
            const isLoading = selectors.UI.ContentTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = selectors.CR.Nodes.destructiveOperationsAreDisabledSelector(state);
            const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
                reference: focusedNodeContextPath
            });

            return {
                focusedNodeContextPath,
                canBePasted,
                canBeDeleted,
                canBeEdited,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled,
                isAllowedToAddChildOrSiblingNodes,
                isCut,
                isCopied
            };
        };
    }, {
        addNode: actions.CR.Nodes.commenceCreation,
        copyNode: actions.CR.Nodes.copy,
        cutNode: actions.CR.Nodes.cut,
        deleteNode: actions.CR.Nodes.commenceRemoval,
        hideNode: actions.CR.Nodes.hide,
        showNode: actions.CR.Nodes.show,
        pasteNode: actions.CR.Nodes.paste,
        reloadTree: actions.UI.ContentTree.reloadTree
    }
)(NodeTreeToolBar));
