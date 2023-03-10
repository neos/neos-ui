import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import Icon from '@neos-project/react-ui-components/src/Icon/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.module.css';

@connect(state => ({
    nodesToBeDeletedContextPaths: state?.cr?.nodes?.toBeRemoved,
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}), {
    confirm: actions.CR.Nodes.confirmRemoval,
    abort: actions.CR.Nodes.abortRemoval
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n'),
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class DeleteNodeModal extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,

        nodesToBeDeletedContextPaths: PropTypes.array,

        getNodeByContextPath: PropTypes.func.isRequired,
        confirm: PropTypes.func.isRequired,
        abort: PropTypes.func.isRequired
    };

    handleAbort = () => {
        const {abort} = this.props;

        abort();
    }

    handleConfirm = () => {
        const {confirm} = this.props;

        confirm();
    }

    renderTitle() {
        const {nodesToBeDeletedContextPaths, getNodeByContextPath, nodeTypesRegistry, i18nRegistry} = this.props;
        if (nodesToBeDeletedContextPaths.length === 1) {
            const singleNodeToBeDeletedContextPath = nodesToBeDeletedContextPaths[0];
            const node = getNodeByContextPath(singleNodeToBeDeletedContextPath);
            const nodeType = node?.nodeType;
            const nodeTypeLabel = nodeTypesRegistry.get(nodeType)?.ui?.label || 'Neos.Neos:Main:node';
            const nodeTypeLabelText = i18nRegistry.translate(nodeTypeLabel, 'Node')
            const deleteLabel = i18nRegistry.translate('delete', 'Delete')
            return (
                <div className={style.modalTitleContainer}>
                    <Icon icon="exclamation-triangle"/>
                    <span className={style.modalTitle}>
                        {deleteLabel}
                        &nbsp;
                        {nodeTypeLabelText}
                        &nbsp;
                        "{node?.label}"
                    </span>
                </div>
            );
        }

        const deleteMultipleNodesLabel = i18nRegistry.translate(
            'deleteXNodes',
            'Delete multiple nodes',
            {amount: nodesToBeDeletedContextPaths.length},
            'Neos.Neos.Ui',
            'Main'
        )
        return (
            <div>
                <Icon icon="exclamation-triangle"/>
                <span className={style.modalTitle}>
                    {deleteMultipleNodesLabel}
                </span>
            </div>
        );
    }

    renderAbort() {
        const abortLabel = this.props.i18nRegistry.translate('cancel', 'Cancel')
        return (
            <Button
                id="neos-DeleteNodeModal-Cancel"
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleAbort}
                >
                {abortLabel}
            </Button>
        );
    }

    renderConfirm() {
        const confirmationLabel = this.props.i18nRegistry.translate('deleteConfirm', 'Confirm')
        return (
            <Button
                id="neos-DeleteNodeModal-Confirm"
                key="confirm"
                style="error"
                hoverStyle="error"
                onClick={this.handleConfirm}
                >
                <Icon icon="ban" className={style.buttonIcon}/>
                {confirmationLabel}
            </Button>
        );
    }

    render() {
        const {nodesToBeDeletedContextPaths, getNodeByContextPath, i18nRegistry, nodeTypesRegistry} = this.props;

        if (nodesToBeDeletedContextPaths.length === 0) {
            return null;
        }
        let node = null;
        const warnings = [];

        nodesToBeDeletedContextPaths.forEach(nodeToBeDeleted => {
            node = getNodeByContextPath(nodeToBeDeleted);
            const nodeLabel = node?.label;
            const deleteMessage = nodeTypesRegistry.get(node.nodeType)?.ui?.deleteConfirmation?.message;
            const nodeType = nodeTypesRegistry.get(node.nodeType)?.ui?.label
            warnings.push({
                'deleteMessage': i18nRegistry.translate(deleteMessage),
                'nodeType': i18nRegistry.translate(nodeType, 'Node'),
                'nodeLabelTruncated': nodeLabel.substring(0, 30).substring(0, nodeLabel.substring(0, 30).lastIndexOf(' ')),
                nodeLabel
            });
        });

        return (
            <Dialog
                actions={[this.renderAbort(), this.renderConfirm()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                type="error"
                isOpen
                id="neos-DeleteNodeDialog"
                >
                <div className={style.modalContents}>
                    <p>
                        {i18nRegistry.translate('content.navigate.deleteNodeDialog.header')}
                        &nbsp; {nodesToBeDeletedContextPaths.length > 1 ? `${nodesToBeDeletedContextPaths.length} ${i18nRegistry.translate('nodes', 'nodes', {}, 'Neos.Neos.Ui', 'Main')}` : `"$${node?.label}"`}?
                    </p>
                    {warnings.length > 0 ? <hr /> : ''}
                    {warnings.map((warning, index) => <p key={index}>
                        {warning.nodeType}
                        <i> "{warning.nodeLabelTruncated + (warning.nodeLabelTruncated < warning.nodeLabel ? '...' : '')}"</i>
                        <span> : </span>
                        {warning.deleteMessage}</p>
                    )}
                </div>
            </Dialog>
        );
    }
}
