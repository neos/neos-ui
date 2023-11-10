/* eslint-disable complexity */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Icon from '@neos-project/react-ui-components/src/Icon/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const {baseWorkspaceSelector, personalWorkspaceNameSelector, personalWorkspaceRebaseStatusSelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import style from './style.module.css';

@connect(state => ({
    personalWorkspaceName: personalWorkspaceNameSelector(state),
    baseWorkspace: baseWorkspaceSelector(state),
    personalWorkspaceStatus: personalWorkspaceRebaseStatusSelector(state)
}), {
    rebaseWorkspaceAction: actions.CR.Workspaces.rebaseWorkspaceAction
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class WorkspaceSync extends PureComponent {
    static propTypes = {
        personalWorkspaceStatus: PropTypes.string.isRequired,
        rebaseWorkspaceAction: PropTypes.func.isRequired,
        personalWorkspaceName: PropTypes.string.isRequired,
        baseWorkspace: PropTypes.string.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleRebaseClick = () => {
        const {publishableNodesInDocument, rebaseWorkspaceAction, baseWorkspace} = this.props;

        rebaseWorkspaceAction(publishableNodesInDocument.map(node => node?.contextPath), baseWorkspace);
    }

    render() {
        const {
            personalWorkspaceStatus,
            i18nRegistry
        } = this.props;

        let icon = 'resource://Neos.Neos.Ui/Icons/sync_check.svg';
        switch (personalWorkspaceStatus) {
            case 'OUTDATED':
                icon = 'resource://Neos.Neos.Ui/Icons/sync.svg';
                break;
            case 'OUTDATED_CONFLICT':
                icon = 'resource://Neos.Neos.Ui/Icons/sync_alert.svg';
                break;
        }
        return (
            <div id="neos-WorkspaceSync" className={style.wrapper}>
                <AbstractButton
                    id="neos-workspace-rebase"
                    className={style.rebaseButton}
                    onClick={this.handleRebaseClick}
                    isEnabled={personalWorkspaceStatus !== 'UP_TO_DATE'}
                    isOutdated={personalWorkspaceStatus === 'OUTDATED'}
                    isError={personalWorkspaceStatus === 'OUTDATED_CONFLICT'}
                    label="sync with parent workspace"
                    >
                    <Icon icon={icon} className={style.iconRebase} size="1x"/>
                </AbstractButton>
            </div>
        );
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
