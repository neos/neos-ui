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
        isLoading: PropTypes.bool.isRequired,
        isHidden: PropTypes.bool.isRequired,
        destructiveOperationsAreDisabled: PropTypes.bool.isRequired,

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
        const {addNode} = this.props;

        addNode(contextPath);
    }

    handleHideNode = contextPath => {
        const {hideNode} = this.props;

        hideNode(contextPath);
    }

    handleShowNode = contextPath => {
        const {showNode} = this.props;

        showNode(contextPath);
    }

    handleCopyNode = contextPath => {
        const {copyNode} = this.props;

        copyNode(contextPath);
    }

    handleCutNode = contextPath => {
        const {cutNode} = this.props;

        cutNode(contextPath);
    }

    handlePasteNode = contextPath => {
        const {pasteNode} = this.props;

        pasteNode(contextPath);
    }

    handleDeleteNode = contextPath => {
        const {deleteNode} = this.props;

        deleteNode(contextPath);
    }

    handleReloadTree = () => {
        const {reloadTree} = this.props;

        reloadTree();
    }

    render() {
        const {
            focusedNodeContextPath,
            canBePasted,
            isHidden,
            isLoading,
            destructiveOperationsAreDisabled
        } = this.props;

        return (
            <div className={style.toolBar}>
                <div className={style.toolBar__btnGroup}>
                    <AddNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        onClick={this.handleAddNode}
                        />
                    <HideSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={destructiveOperationsAreDisabled}
                        isHidden={isHidden}
                        onHide={this.handleHideNode}
                        onShow={this.handleShowNode}
                        />
                    <CopySelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        onClick={this.handleCopyNode}
                        isDisabled={destructiveOperationsAreDisabled}
                        />
                    <CutSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={destructiveOperationsAreDisabled}
                        onClick={this.handleCutNode}
                        />
                    <PasteClipBoardNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        canBePasted={canBePasted}
                        onClick={this.handlePasteNode}
                        />
                    <DeleteSelectedNode
                        className={style.toolBar__btnGroup__btn}
                        focusedNodeContextPath={focusedNodeContextPath}
                        isDisabled={destructiveOperationsAreDisabled}
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
        const canBePastedSelector = selectors.CR.Nodes.makeCanBeInsertedSelector(nodeTypesRegistry);

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
            const isLoading = selectors.UI.PageTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = (
                Boolean(focusedNode) === false ||
                $get('isAutoCreated', focusedNode) ||
                siteNodeContextPath === focusedNodeContextPath
            );

            return {
                focusedNodeContextPath,
                canBePasted,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled
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
        const canBePastedSelector = selectors.CR.Nodes.makeCanBeInsertedSelector(nodeTypesRegistry);

        return state => {
            const focusedNodeContextPath = $get('cr.nodes.focused.contextPath', state);
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
            const focusedNode = getNodeByContextPathSelector(state);
            const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
            const canBePasted = canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: focusedNodeContextPath
            });
            const isLoading = selectors.UI.ContentTree.getIsLoading(state);
            const isHidden = $get('properties._hidden', focusedNode);
            const destructiveOperationsAreDisabled = selectors.CR.Nodes.destructiveOperationsAreDisabledSelector(state);

            return {
                focusedNodeContextPath,
                canBePasted,
                isLoading,
                isHidden,
                destructiveOperationsAreDisabled
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
