/* eslint-disable complexity */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '@neos-project/react-ui-components/src/Icon/';
import Button from '@neos-project/react-ui-components/src/Button/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const {personalWorkspaceRebaseStatusSelector} = selectors.CR.Workspaces;

import style from './style.module.css';
import {WorkspaceStatus} from '@neos-project/neos-ts-interfaces';

@connect(state => ({
    isOpen: state?.ui?.SyncWorkspaceModal?.isOpen,
    isSaving: state?.ui?.remote?.isSaving,
    personalWorkspaceStatus: personalWorkspaceRebaseStatusSelector(state)
}), {
    openModal: actions.UI.SyncWorkspaceModal.open
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class WorkspaceSync extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        isSaving: PropTypes.bool.isRequired,
        openModal: PropTypes.func.isRequired,
        personalWorkspaceStatus: PropTypes.string.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    render() {
        const {
            personalWorkspaceStatus,
            openModal,
            isSaving,
            isOpen
        } = this.props;
        let icon = 'resource://Neos.Neos.Ui/Icons/syncronize_check.svg';
        switch (personalWorkspaceStatus) {
            case WorkspaceStatus.OUTDATED:
                icon = 'resource://Neos.Neos.Ui/Icons/syncronize.svg';
                break;
            case WorkspaceStatus.OUTDATED_CONFLICT:
                icon = 'resource://Neos.Neos.Ui/Icons/syncronize_alert.svg';
                break;
        }
        if (personalWorkspaceStatus !== 'UP_TO_DATE') {
            return (
                <div id="neos-WorkspaceSync" className={style.wrapper}>
                    <Button
                        id="neos-workspace-rebase"
                        className={style.rebaseButton}
                        onClick={openModal}
                        disabled={isSaving || isOpen}
                        style={personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                        hoverStyle={personalWorkspaceStatus === WorkspaceStatus.OUTDATED ? 'warn' : 'error'}
                        label="sync with parent workspace"
                    >
                        <Icon icon={icon} className={style.iconRebase} size="1x"/>
                    </Button>
                </div>
            );
        }
        return (null);
    }

   /* getTranslatedMainButton(baseWorkspaceTitle = '') {
        const {
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isDiscarding
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.length > 0);

        if (isSaving) {
            return <I18n id="Neos.Neos:Main:saving" fallback="saving"/>;
        }

        if (isPublishing) {
            return <I18n id="Neos.Neos:Main:publishTo" fallback="Publish to" params={{0: baseWorkspaceTitle}}/>;
        }

        if (isDiscarding) {
            return 'Discarding...';
        }

        if (canPublishLocally) {
            return <I18n id="Neos.Neos:Main:publishTo" fallback="Publish to" params={{0: baseWorkspaceTitle}}/>;
        }

        return (
            <Fragment>
                <I18n id="Neos.Neos:Main:published" fallback="Published"/>
                {(baseWorkspaceTitle ? ' - ' + baseWorkspaceTitle : '')}
            </Fragment>
        );
    } */
}
