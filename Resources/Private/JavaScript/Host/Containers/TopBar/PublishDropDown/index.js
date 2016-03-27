import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {$transform, $get} from 'plow-js';

import {
    I18n,
    Icon,
    DropDown,
    CheckBox,
    Label
} from 'Components/index';
import {actions} from 'Host/Redux/index';
import {publishableNodesSelector, publishableNodesInDocumentSelector} from 'Host/Selectors/CR/Workspaces/index';

import AbstractButton from './AbstractButton/index';
import style from './style.css';

@connect($transform({
    isSaving: $get('ui.remote.isSaving'),
    isPublishing: $get('ui.remote.isPublishing'),
    isDiscarding: $get('ui.remote.isDiscarding'),
    publishableNodes: publishableNodesSelector,
    publishableNodesInDocument: publishableNodesInDocumentSelector,
    isAutoPublishingEnabled: $get('user.settings.isAutoPublishingEnabled')
}), {
    toggleAutoPublishing: actions.User.Settings.toggleAutoPublishing,
    publishAction: actions.CR.Workspaces.publish,
    discardAction: actions.CR.Workspaces.discard
})
export default class PublishDropDown extends Component {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        publishableNodes: ImmutablePropTypes.list,
        publishableNodesInDocument: ImmutablePropTypes.list,
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired,
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired
    };

    render() {
        const {
            publishableNodes,
            publishableNodesInDocument,
            isSaving,
            isAutoPublishingEnabled,
            toggleAutoPublishing
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);
        const canPublishGlobally = publishableNodes && (publishableNodes.count() > 0);
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const {mainButtonLabel, mainButtonTarget} = this.getMainButtonLabeling();
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__item--canPublish']]: canPublishGlobally
        });

        return (
            <div className={style.wrapper}>
                <AbstractButton
                    className={style.publishBtn}
                    isEnabled={canPublishLocally || isSaving}
                    isHighlighted={canPublishLocally || isSaving}
                    indicator={publishableNodesInDocument ? publishableNodesInDocument.count() : 0}
                    onClick={e => this.onPublishClick(e)}
                    id="neos__topBar__publishDropDown__publishBtn"
                    >
                    <I18n fallback={mainButtonTarget} id={mainButtonLabel} />
                </AbstractButton>

                <DropDown className={style.dropDown}>
                    <DropDown.Header
                        className={dropDownBtnClassName}
                        id="neos__topBar__publishDropDown__btn"
                        >
                    </DropDown.Header>

                    <DropDown.Contents
                        className={style.dropDown__contents}
                        id="neos__topBar__publishDropDown__contents"
                        >
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                indicator={publishableNodes ? publishableNodes.count() : 0}
                                onClick={e => this.onPublishAllClick(e)}
                                id="neos__topBar__publishDropDown__publishAllBtn"
                                >
                                <Icon icon="upload" />
                                <I18n fallback="Publish All" id="publishAll" />
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishLocally}
                                isHighlighted={false}
                                indicator={publishableNodesInDocument ? publishableNodesInDocument.count() : 0}
                                label="Discard"
                                icon="ban"
                                onClick={e => this.onDiscardClick(e)}
                                id="neos__topBar__publishDropDown__discardBtn"
                                >
                                <Icon icon="ban" />
                                <I18n fallback="Discard" id="discard" />
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                isEnabled={canPublishGlobally}
                                isHighlighted={false}
                                indicator={publishableNodes ? publishableNodes.count() : 0}
                                onClick={e => this.onDiscardAllClick(e)}
                                id="neos__topBar__publishDropDown__discardAllBtn"
                                >
                                <Icon icon="ban" />
                                <I18n fallback="Discard All" id="discardAll" />
                            </AbstractButton>
                        </li>
                        <li className={autoPublishWrapperClassNames}>
                            <Label htmlFor="neos__topBar__publishDropDown__autoPublishingEnabledCheckbox">
                                <CheckBox
                                    id="neos__topBar__publishDropDown__autoPublishingEnabledCheckbox"
                                    onChange={() => toggleAutoPublishing()}
                                    isChecked={isAutoPublishingEnabled}
                                    />
                                <I18n id="autoPublish" fallback="Auto-Publish" />
                            </Label>
                        </li>
                        <li className={style.dropDown__item}>
                            <a href="/neos/management/workspaces" id="neos__topBar__publishDropDown__workspacesBtn">
                                <Icon icon="th-large" />
                                <I18n fallback="Workspaces" id="workspaces" />
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

    onPublishClick() {
        const {publishableNodesInDocument, publishAction} = this.props;

        publishAction(publishableNodesInDocument.map(i => i.contextPath), 'live');
    }

    onPublishAllClick() {
        const {publishableNodes, publishAction} = this.props;
        publishAction(publishableNodes.map(i => i.contextPath), 'live');
    }

    onDiscardClick() {
        const {publishableNodesInDocument, discardAction} = this.props;

        discardAction(publishableNodesInDocument.map(i => i.contextPath));
    }

    onDiscardAllClick() {
        const {publishableNodes, discardAction} = this.props;

        discardAction(publishableNodes.map(i => i.contextPath));
    }
}
