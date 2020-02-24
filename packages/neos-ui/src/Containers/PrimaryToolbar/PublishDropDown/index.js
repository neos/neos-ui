/* eslint-disable complexity */
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
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
    discardAction: actions.CR.Workspaces.commenceDiscard
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class PublishDropDown extends PureComponent {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        isWorkspaceReadOnly: PropTypes.bool,
        publishableNodes: PropTypes.array,
        publishableNodesInDocument: PropTypes.array,
        personalWorkspaceName: PropTypes.string.isRequired,
        baseWorkspace: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired,
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        routes: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired
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
            isPublishing,
            isDiscarding,
            isAutoPublishingEnabled,
            isWorkspaceReadOnly,
            toggleAutoPublishing,
            baseWorkspace,
            changeBaseWorkspaceAction,
            i18nRegistry,
            neos
        } = this.props;

        const workspaceModuleUri = $get('routes.core.modules.workspaces', neos);
        const allowedWorkspaces = $get('configuration.allowedTargetWorkspaces', neos);
        const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);
        const canPublishLocally = !isSaving && !isPublishing && !isDiscarding && publishableNodesInDocument && (publishableNodesInDocument.length > 0);
        const canPublishGlobally = !isSaving && !isPublishing && !isDiscarding && publishableNodes && (publishableNodes.length > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const mainButton = this.getTranslatedMainButton(baseWorkspaceTitle);
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__item--canPublish']]: canPublishGlobally,
            [style['dropDown__item--isPublishing']]: isPublishing,
            [style['dropDown__item--isSaving']]: isSaving,
            [style['dropDown__item--isDiscarding']]: isDiscarding
        });
        const publishableNodesInDocumentCount = publishableNodesInDocument ? publishableNodesInDocument.length : 0;
        const publishableNodesCount = publishableNodes ? publishableNodes.length : 0;
        return (
            <div id="neos-PublishDropDown" className={style.wrapper}>
                <AbstractButton
                    id="neos-PublishDropDown-Publish"
                    className={style.publishBtn}
                    isEnabled={!isWorkspaceReadOnly && (canPublishLocally)}
                    isHighlighted={canPublishLocally || isSaving || isPublishing}
                    onClick={this.handlePublishClick}
                    >
                    {mainButton} {isWorkspaceReadOnly ? (<Icon icon="lock"/>) : ''}
                    {publishableNodesInDocumentCount > 0 && <Badge className={style.badge} label={String(publishableNodesInDocumentCount)}/>}
                </AbstractButton>

                <DropDown className={style.dropDown}>
                    {isPublishing || isSaving || isDiscarding ? (
                        <DropDown.Header
                            iconIsOpen={'spinner'}
                            iconIsClosed={'spinner'}
                            iconRest={{spin: true, transform: 'up-8'}}
                            className={dropDownBtnClassName}
                            disabled
                            aria-label={i18nRegistry.translate('Neos.Neos:Main:showPublishOptions', 'Show publishing options')}
                        />
                    ) : (
                        <DropDown.Header
                            className={dropDownBtnClassName}
                            aria-label={i18nRegistry.translate('Neos.Neos:Main:showPublishOptions', 'Show publishing options')}
                        />
                    )}
                    <DropDown.Contents
                        className={style.dropDown__contents}
                        >
                        { Object.keys(allowedWorkspaces).length > 1 && <li className={style.dropDown__item}>
                            <WorkspaceSelector
                                baseWorkspace={baseWorkspace}
                                allowedWorkspaces={allowedWorkspaces}
                                changeBaseWorkspaceAction={changeBaseWorkspaceAction}
                                changingWorkspaceAllowed={changingWorkspaceAllowed}
                                />
                        </li> }
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-PublishAll"
                                isEnabled={!isWorkspaceReadOnly && canPublishGlobally}
                                isHighlighted={false}
                                onClick={this.handlePublishAllClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="check-double"/>
                                </div>
                                <I18n id="Neos.Neos:Main:publishAll" fallback="Publish All"/>
                                {publishableNodesCount > 0 && <Badge className={style.badge} label={String(publishableNodesCount)}/>}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-Discard"
                                isEnabled={canPublishLocally}
                                isHighlighted={false}
                                label="Discard"
                                icon="ban"
                                onClick={this.handleDiscardClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="ban"/>
                                </div>
                                <I18n id="Neos.Neos:Main:discard" fallback="Discard"/>
                                {publishableNodesInDocumentCount > 0 && <Badge className={style.badge} label={String(publishableNodesInDocumentCount)}/>}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-DiscardAll"
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                onClick={this.handleDiscardAllClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="ban"/>
                                </div>
                                <I18n id="Neos.Neos:Main:discardAll" fallback="Discard All"/>
                                {publishableNodesCount > 0 && <Badge className={style.badge} label={String(publishableNodesCount)}/>}
                            </AbstractButton>
                        </li>
                        {publishableNodesCount > 0 && (<li className={style.dropDown__item}>
                            <a id="neos-PublishDropDown-ReviewChanges" href={workspaceModuleUri + '/show?moduleArguments[workspace]=' + this.props.personalWorkspaceName}>
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="check-circle"/>
                                </div>
                                <I18n id="Neos.Neos:Main:reviewChanges" fallback="Review changes"/>
                            </a>
                        </li>)}
                        <li className={autoPublishWrapperClassNames}>
                            <Label htmlFor="neos-PublishDropDown-AutoPublish">
                                <
// @ts-ignore
                                CheckBox
                                    id="neos-PublishDropDown-AutoPublish"
                                    onChange={toggleAutoPublishing}
                                    isChecked={isAutoPublishingEnabled}
                                    />
                                <I18n id="Neos.Neos:Main:autoPublish" fallback="Auto-Publish"/>
                            </Label>
                        </li>
                        <li className={style.dropDown__item}>
                            <a id="neos-PublishDropDown-Workspaces" href={workspaceModuleUri}>
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="th-large"/>
                                </div>
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
