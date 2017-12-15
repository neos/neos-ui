import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import Badge from '@neos-project/react-ui-components/src/Badge/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import CheckBox from '@neos-project/react-ui-components/src/CheckBox/';
import Label from '@neos-project/react-ui-components/src/Label/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';

import I18n from '@neos-project/neos-ui-i18n';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const {publishableNodesSelector, publishableNodesInDocumentSelector, baseWorkspaceSelector, isWorkspaceReadOnlySelector, personalWorkspaceNameSelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import WorkspaceSelector from './WorkspaceSelector/index';
import style from './style.css';

@connect($transform({
    isSaving: $get('ui.remote.isSaving'),
    isPublishing: $get('ui.remote.isPublishing'),
    isDiscarding: $get('ui.remote.isDiscarding'),
    publishableNodes: publishableNodesSelector,
    publishableNodesInDocument: publishableNodesInDocumentSelector,
    personalWorkspaceName: personalWorkspaceNameSelector,
    baseWorkspace: baseWorkspaceSelector,
    isWorkspaceReadOnly: isWorkspaceReadOnlySelector,
    isAutoPublishingEnabled: $get('user.settings.isAutoPublishingEnabled')
}), {
    toggleAutoPublishing: actions.User.Settings.toggleAutoPublishing,
    changeBaseWorkspaceAction: actions.CR.Workspaces.changeBaseWorkspace,
    publishAction: actions.CR.Workspaces.publish,
    discardAction: actions.CR.Workspaces.discard
})
@neos()
export default class PublishDropDown extends PureComponent {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        isWorkspaceReadOnly: PropTypes.bool,
        publishableNodes: ImmutablePropTypes.list,
        publishableNodesInDocument: ImmutablePropTypes.list,
        personalWorkspaceName: PropTypes.string.isRequired,
        baseWorkspace: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired,
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        routes: PropTypes.object
    };

    handlePublishClick = () => {
        const {publishableNodesInDocument, publishAction, baseWorkspace} = this.props;

        publishAction(publishableNodesInDocument.map($get('contextPath')), baseWorkspace);
    }

    handlePublishAllClick = () => {
        const {publishableNodes, publishAction, baseWorkspace} = this.props;

        publishAction(publishableNodes.map($get('contextPath')), baseWorkspace);
    }

    handleDiscardClick = () => {
        const {publishableNodesInDocument, discardAction} = this.props;

        discardAction(publishableNodesInDocument.map($get('contextPath')));
    }

    handleDiscardAllClick = () => {
        const {publishableNodes, discardAction} = this.props;

        discardAction(publishableNodes.map($get('contextPath')));
    }

    render() {
        const {
            publishableNodes,
            publishableNodesInDocument,
            isSaving,
            isAutoPublishingEnabled,
            isWorkspaceReadOnly,
            toggleAutoPublishing,
            baseWorkspace,
            changeBaseWorkspaceAction,
            neos
        } = this.props;

        const workspaceModuleUri = $get('routes.core.modules.workspaces', neos);
        const allowedWorkspaces = $get('configuration.allowedTargetWorkspaces', neos);
        const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);
        const canPublishGlobally = publishableNodes && (publishableNodes.count() > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const mainButton = this.getTranslatedMainButton(baseWorkspaceTitle);
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__item--canPublish']]: canPublishGlobally
        });
        const publishableNodesInDocumentCount = publishableNodesInDocument ? publishableNodesInDocument.count() : 0;
        const publishableNodesCount = publishableNodes ? publishableNodes.count() : 0;

        return (
            <div className={style.wrapper}>
                <AbstractButton
                    className={style.publishBtn}
                    isEnabled={!isWorkspaceReadOnly && (canPublishLocally || isSaving)}
                    isHighlighted={canPublishLocally || isSaving}
                    onClick={this.handlePublishClick}
                    >
                    {mainButton} {isWorkspaceReadOnly ? (<Icon icon="lock"/>) : ''}
                    {publishableNodesInDocumentCount > 0 && <Badge className={style.badge} label={String(publishableNodesInDocumentCount)}/>}
                </AbstractButton>

                <DropDown className={style.dropDown}>
                    <DropDown.Header
                        className={dropDownBtnClassName}
                        />

                    <DropDown.Contents
                        className={style.dropDown__contents}
                        >
                        <li className={style.dropDown__item}>
                            <WorkspaceSelector
                                baseWorkspace={baseWorkspace}
                                allowedWorkspaces={allowedWorkspaces}
                                changeBaseWorkspaceAction={changeBaseWorkspaceAction}
                                changingWorkspaceAllowed={changingWorkspaceAllowed}
                                />
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={!isWorkspaceReadOnly && canPublishGlobally}
                                isHighlighted={false}
                                onClick={this.handlePublishAllClick}
                                >
                                <Icon icon="upload"/>
                                <I18n id="Neos.Neos:Main:publishAll" fallback="Publish All"/>
                                {publishableNodesCount > 0 && ` (${publishableNodesCount})`}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishLocally}
                                isHighlighted={false}
                                label="Discard"
                                icon="ban"
                                onClick={this.handleDiscardClick}
                                >
                                <Icon icon="ban"/>
                                <I18n id="Neos.Neos:Main:discard" fallback="Discard"/>
                                {publishableNodesInDocumentCount > 0 && ` (${publishableNodesInDocumentCount})`}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                onClick={this.handleDiscardAllClick}
                                >
                                <Icon icon="ban"/>
                                <I18n id="Neos.Neos:Main:discardAll" fallback="Discard All"/>
                                {publishableNodesCount > 0 && ` (${publishableNodesCount})`}
                            </AbstractButton>
                        </li>
                        {publishableNodesCount > 0 && (<li className={style.dropDown__item}>
                            <a href={workspaceModuleUri + '/show?moduleArguments[workspace]=' + this.props.personalWorkspaceName}>
                                <Icon icon="check-circle"/>
                                <I18n id="Neos.Neos:Main:reviewChanges" fallback="Review changes"/>
                            </a>
                        </li>)}
                        <li className={autoPublishWrapperClassNames}>
                            <Label htmlFor="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox">
                                <CheckBox
                                    id="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox"
                                    onChange={toggleAutoPublishing}
                                    isChecked={isAutoPublishingEnabled}
                                    />
                                <I18n id="Neos.Neos:Main:autoPublish" fallback="Auto-Publish"/>
                            </Label>
                        </li>
                        <li className={style.dropDown__item}>
                            <a href={workspaceModuleUri}>
                                <Icon icon="th-large"/>
                                <I18n id="Neos.Neos:Main:workspaces" fallback="Workspaces"/>
                            </a>
                        </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }

    getTranslatedMainButton(baseWorkspaceTitle = '') {
        const {
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isDiscarding,
            isAutoPublishingEnabled
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);

        if (isSaving) {
            return <I18n id="Neos.Neos:Main:saving" fallback="saving"/>;
        }

        if (isPublishing) {
            return <I18n id="Neos.Neos:Main:publishTo" fallback="Publish to" params={{0: baseWorkspaceTitle}}/>;
        }

        if (isDiscarding) {
            return 'Discarding...';
        }

        if (isAutoPublishingEnabled) {
            if (baseWorkspaceTitle) {
                return <I18n id="Neos.Neos:Main:autoPublishTo" fallback={'Auto publish to ' + baseWorkspaceTitle} params={{0: baseWorkspaceTitle}}/>;
            }
            return <I18n id="Neos.Neos:Main:autoPublish" fallback="Auto publish"/>;
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
    }
}
