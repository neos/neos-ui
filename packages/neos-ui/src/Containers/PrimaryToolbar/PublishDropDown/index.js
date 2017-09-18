import React, {PureComponent} from 'react';
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

const {publishableNodesSelector, publishableNodesInDocumentSelector, baseWorkspaceSelector, isWorkspaceReadOnlySelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import WorkspaceSelector from './WorkspaceSelector/index';
import style from './style.css';

@connect($transform({
    isSaving: $get('ui.remote.isSaving'),
    isPublishing: $get('ui.remote.isPublishing'),
    isDiscarding: $get('ui.remote.isDiscarding'),
    publishableNodes: publishableNodesSelector,
    publishableNodesInDocument: publishableNodesInDocumentSelector,
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
        baseWorkspace: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired,
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired
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

        const allowedWorkspaces = $get('configuration.allowedTargetWorkspaces', neos);
        const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);
        const canPublishGlobally = publishableNodes && (publishableNodes.count() > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const {mainButtonLabel, mainButtonTarget} = this.getMainButtonLabeling();
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
                    <I18n fallback={mainButtonTarget} id={mainButtonLabel}/> <I18n id="to"/> {isWorkspaceReadOnly ? (<Icon icon="lock"/>) : ''} {baseWorkspaceTitle}
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
                                <I18n fallback="Publish All" id="publishAll"/>
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
                                <I18n fallback="Discard" id="discard"/>
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
                                <I18n fallback="Discard All" id="discardAll"/>
                                {publishableNodesCount > 0 && ` (${publishableNodesCount})`}
                            </AbstractButton>
                        </li>
                        <li className={autoPublishWrapperClassNames}>
                            <Label htmlFor="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox">
                                <CheckBox
                                    id="neos__primaryToolbar__publishDropDown__autoPublishingEnabledCheckbox"
                                    onChange={toggleAutoPublishing}
                                    isChecked={isAutoPublishingEnabled}
                                    />
                                <I18n id="autoPublish" fallback="Auto-Publish"/>
                            </Label>
                        </li>
                        <li className={style.dropDown__item}>
                            <a href="/neos/management/workspaces">
                                <Icon icon="th-large"/>
                                <I18n fallback="Workspaces" id="workspaces"/>
                            </a>
                        </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }

    getMainButtonLabeling() {
        const {
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isDiscarding,
            isAutoPublishingEnabled
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);

        if (isSaving) {
            return {
                mainButtonLabel: 'saving',
                mainButtonTarget: 'Saving...'
            };
        }

        if (isPublishing) {
            return {
                mainButtonLabel: 'publishing',
                mainButtonTarget: 'Publishing...'
            };
        }

        if (isDiscarding) {
            return {
                mainButtonLabel: 'discarding',
                mainButtonTarget: 'Discarding...'
            };
        }

        if (isAutoPublishingEnabled) {
            return {
                mainButtonLabel: 'autoPublish',
                mainButtonTarget: 'Auto-Publish'
            };
        }

        if (canPublishLocally) {
            return {
                mainButtonLabel: 'publish',
                mainButtonTarget: 'Publish'
            };
        }

        return {
            mainButtonLabel: 'published',
            mainButtonTarget: 'Published'
        };
    }
}
