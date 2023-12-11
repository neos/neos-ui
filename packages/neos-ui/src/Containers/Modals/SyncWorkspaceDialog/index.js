import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/src/Button/';
import Dialog from '@neos-project/react-ui-components/src/Dialog/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import WorkspaceSyncIcon from '../../PrimaryToolbar/WorkspaceSync/WorkspaceSyncIcon';

const {personalWorkspaceNameSelector, personalWorkspaceRebaseStatusSelector} = selectors.CR.Workspaces;

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import style from './style.module.css';
import {WorkspaceStatus} from '@neos-project/neos-ts-interfaces';

@connect(state => ({
    isOpen: state?.ui?.SyncWorkspaceModal?.isOpen,
    personalWorkspaceStatus: personalWorkspaceRebaseStatusSelector(state),
    personalWorkspaceName: personalWorkspaceNameSelector(state)
}), {
    confirmRebase: actions.UI.SyncWorkspaceModal.apply,
    abortRebase: actions.UI.SyncWorkspaceModal.cancel,
    rebaseWorkspace: actions.CR.Workspaces.rebaseWorkspace
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class SyncWorkspaceDialog extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        personalWorkspaceStatus: PropTypes.string.isRequired,
        personalWorkspaceName: PropTypes.string.isRequired,
        confirmRebase: PropTypes.func.isRequired,
        abortRebase: PropTypes.func.isRequired,
        rebaseWorkspace: PropTypes.func.isRequired
    };

    handleAbort = () => {
        const {abortRebase} = this.props;

        abortRebase();
    }

    handleConfirm = () => {
        const {confirmRebase, rebaseWorkspace, personalWorkspaceName} = this.props;
        confirmRebase();
        rebaseWorkspace(personalWorkspaceName);
    }

    renderTitle() {
        const {i18nRegistry} = this.props;

        const synchronizeWorkspaceLabel = i18nRegistry.translate(
            'syncPersonalWorkSpace',
            'Synchronize personal workspace', {}, 'Neos.Neos.Ui', 'Main')
        return (
            <div className={style.modalTitle}>
                <WorkspaceSyncIcon personalWorkspaceStatus={WorkspaceStatus.OUTDATED_CONFLICT} onDarkBackground={true}/>
                <span>
                    {synchronizeWorkspaceLabel}
                </span>
            </div>
        );
    }

    renderAbort() {
        const abortLabel = this.props.i18nRegistry.translate('cancel', 'Cancel')
        return (
            <Button
                id="neos-SyncWorkspace-Cancel"
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
        const {i18nRegistry, personalWorkspaceStatus} = this.props;
        const confirmationLabel = i18nRegistry.translate(
            'syncPersonalWorkSpaceConfirm',
            'Synchronize now', {}, 'Neos.Neos.Ui', 'Main')
        if (personalWorkspaceStatus !== WorkspaceStatus.OUTDATED) {
            return (null);
        }
        return (
            <Button
                id="neos-SyncWorkspace-Confirm"
                key="confirm"
                style="warn"
                hoverStyle="warn"
                onClick={this.handleConfirm}
            >
                <Icon icon="sync" className={style.buttonIcon}/>
                <span className={style.confirmText}>
                    {confirmationLabel}
                </span>
            </Button>
        );
    }

    render() {
        const {isOpen, personalWorkspaceStatus} = this.props;
        if (!isOpen) {
            return null;
        }
        const dialogMessage = this.getTranslatedContent();
        return (
            <Dialog
                actions={[this.renderAbort(), this.renderConfirm()]}
                title={this.renderTitle()}
                onRequestClose={this.handleAbort}
                type={personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                isOpen
                id="neos-DeleteNodeDialog"
            >
                <div className={style.modalContents}>
                    <p>{dialogMessage}</p>
                </div>
            </Dialog>
        );
    }

    getTranslatedContent() {
        const {personalWorkspaceStatus, i18nRegistry} = this.props;
        if (personalWorkspaceStatus === WorkspaceStatus.OUTDATED) {
            return i18nRegistry.translate(
                'syncPersonalWorkSpaceMessageOutdated',
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'You should synchronize your personal workspace to avoid conflicts.', {}, 'Neos.Neos.Ui', 'Main')
        }
        if (personalWorkspaceStatus === WorkspaceStatus.OUTDATED_CONFLICT) {
            return i18nRegistry.translate(
                'syncPersonalWorkSpaceMessageOutdatedConflict',
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'The changes lead to an error state. Please contact your administrator to resolve the problem.', {}, 'Neos.Neos.Ui', 'Main')
        }
        return i18nRegistry.translate(
            'syncPersonalWorkSpaceMessage',
            'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
            'The changes lead to an error state. Please contact your administrator to resolve the problem.', {}, 'Neos.Neos.Ui', 'Main')
    }
}
