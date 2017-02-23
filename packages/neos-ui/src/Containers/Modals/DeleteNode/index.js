import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get, $transform} from 'plow-js';

import Button from '@neos-project/react-ui-components/lib/Button/';
import Dialog from '@neos-project/react-ui-components/lib/Dialog/';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import I18n from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.css';

@connect($transform({
    nodeToBeDeletedContextPath: $get('cr.nodes.toBeRemoved'),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath
}), {
    confirm: actions.CR.Nodes.confirmRemoval,
    abort: actions.CR.Nodes.abortRemoval
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class DeleteNodeModal extends PureComponent {
    static propTypes = {
        nodeTypesRegistry: PropTypes.object.isRequired,

        nodeToBeDeletedContextPath: PropTypes.string,

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
        const {nodeToBeDeletedContextPath, getNodeByContextPath, nodeTypesRegistry} = this.props;
        const node = getNodeByContextPath(nodeToBeDeletedContextPath);
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

    renderAbort() {
        return (
            <Button
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
                key="confirm"
                style="warn"
                hoverStyle="brand"
                onClick={this.handleConfirm}
                >
                <I18n id="Neos.Neos:Main:confirm" fallback="Confirm"/>
            </Button>
        );
    }

    render() {
        const {nodeToBeDeletedContextPath, getNodeByContextPath} = this.props;
        const node = getNodeByContextPath(nodeToBeDeletedContextPath);

        if (!node) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderAbort(), this.renderConfirm()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                isOpen
                >
                <div className={style.modalContents}>
                    <I18n id="Neos.Neos:Main:content.navigate.deleteNodeDialog.header"/>
                    &nbsp; "{$get('label', node)}"?
                </div>
            </Dialog>
        );
    }
}
