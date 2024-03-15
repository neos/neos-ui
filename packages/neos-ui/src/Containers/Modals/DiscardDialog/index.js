import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishDiscardSope} from '@neos-project/neos-ui-redux-store/src/CR/Workspaces';

import style from './style.module.css';

const {publishableNodesSelector, publishableNodesInDocumentSelector} = selectors.CR.Workspaces;

@connect(state => {
    const scope = state?.CR?.Workspaces?.scope;

    let numberOfChangesToBeDiscarded = 0;
    if (scope === PublishDiscardSope.SITE) {
        numberOfChangesToBeDiscarded = publishableNodesSelector(state);
    } else if (scope === PublishDiscardSope.DOCUMENT) {
        numberOfChangesToBeDiscarded = publishableNodesInDocumentSelector(state);
    }

    return {numberOfChangesToBeDiscarded};
}, {
    confirm: actions.CR.Workspaces.confirmDiscard,
    abort: actions.CR.Workspaces.abortDiscard
})
export default class DiscardDialog extends PureComponent {
    static propTypes = {
        numberOfChangesToBeDiscarded: PropTypes.array,
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
        return (
            <div>
                <Icon icon="exclamation-triangle"/>
                <span className={style.modalTitle}>
                    <I18n id="Neos.Neos:Main:discard" fallback="Discard"/>
                </span>
            </div>
        );
    }

    renderAbort() {
        return (
            <Button
                id="neos-DiscardDialog-Cancel"
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
                id="neos-DiscardDialog-Confirm"
                key="confirm"
                style="error"
                hoverStyle="error"
                onClick={this.handleConfirm}
                >
                <Icon icon="ban" className={style.buttonIcon}/>
                <I18n id="Neos.Neos:Main:discard" fallback="Discard"/>
            </Button>
        );
    }

    render() {
        const {numberOfChangesToBeDiscarded: numberOfChanges} = this.props;
        if (numberOfChanges === 0) {
            return null;
        }

        return (
            <Dialog
                actions={[this.renderAbort(), this.renderConfirm()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                type="error"
                isOpen
                id="neos-DiscardDialog"
                >
                <div className={style.modalContents}>
                    <I18n
                        id="Neos.Neos:Main:content.components.discardAllDialog.discardXChangesSubheader"
                        params={{numberOfChanges}}
                        fallback={`Are you sure that you want to discard ${numberOfChanges} change(s) in this workspace?`}
                        />
                </div>
            </Dialog>
        );
    }
}
