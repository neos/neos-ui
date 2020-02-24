import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import I18n from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@connect($transform({
    nodesToBeDeletedContextPaths: $get('cr.nodes.toBeRemoved'),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath
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
        const {nodesToBeDeletedContextPaths, getNodeByContextPath, nodeTypesRegistry} = this.props;
        if (nodesToBeDeletedContextPaths.length === 1) {
            const singleNodeToBeDeletedContextPath = nodesToBeDeletedContextPaths[0];
            const node = getNodeByContextPath(singleNodeToBeDeletedContextPath);
            const nodeType = $get('nodeType', node);
            const nodeTypeLabel = $get('ui.label', nodeTypesRegistry.get(nodeType)) || 'Neos.Neos:Main:node';
            return (
                <div>
                    <Icon icon="exclamation-triangle"/>
                    <span className={style.modalTitle}>
                        <I18n id="Neos.Neos:Main:delete" fallback="Delete"/>
                        &nbsp;
                        <I18n id={nodeTypeLabel} fallback="Node"/>
                        &nbsp;
                        "{$get('label', node)}"
                    </span>
                </div>
            );
        }
        return (
            <div>
                <Icon icon="exclamation-triangle"/>
                <span className={style.modalTitle}>
                    <I18n
                        id="Neos.Neos.Ui:Main:deleteXNodes"
                        params={{
                            amount: nodesToBeDeletedContextPaths.length
                        }}
                        fallback="Delete multiple nodes"
                        />
                </span>
            </div>
        );
    }

    renderAbort() {
        return (
            <Button
                id="neos-DeleteNodeModal-Cancel"
                key="cancel"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleAbort}
                >
                <I18n id="Neos.Neos:Main:cancel" fallback="Cancel"/>
            </Button>
        );
    }

    renderConfirm() {
        return (
            <Button
                id="neos-DeleteNodeModal-Confirm"
                key="confirm"
                style="error"
                hoverStyle="error"
                onClick={this.handleConfirm}
                >
                <Icon icon="ban" className={style.buttonIcon}/>
                <I18n id="Neos.Neos:Main:deleteConfirm" fallback="Confirm"/>
            </Button>
        );
    }

    render() {
        const {nodesToBeDeletedContextPaths, getNodeByContextPath, i18nRegistry} = this.props;
        let node = null;
        if (nodesToBeDeletedContextPaths.length === 1) {
            const singleNodeToBeDeletedContextPath = nodesToBeDeletedContextPaths[0];
            node = getNodeByContextPath(singleNodeToBeDeletedContextPath);
        }

        if (nodesToBeDeletedContextPaths.length === 0) {
            return null;
        }

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
                    <I18n id="Neos.Neos:Main:content.navigate.deleteNodeDialog.header"/>
                    &nbsp; {nodesToBeDeletedContextPaths.length > 1 ? `${nodesToBeDeletedContextPaths.length} ${i18nRegistry.translate('nodes', 'nodes', {}, 'Neos.Neos.Ui', 'Main')}` : `"${$get('label', node)}"`}?
                </div>
            </Dialog>
        );
    }
}
