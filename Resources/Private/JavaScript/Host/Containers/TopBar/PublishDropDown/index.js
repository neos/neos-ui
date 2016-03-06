import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Immutable from 'immutable';
import {immutableOperations} from 'Shared/Utilities/';
import {backend} from 'Host/Service/';
import {
    I18n,
    Icon,
    DropDown,
    Label,
    CheckBox
} from 'Host/Components/';
import {actions} from 'Host/Redux/';
import style from './style.css';
import AbstractButton from './AbstractButton/';

const {$get, $mapGet} = immutableOperations;

@connect(state => {
    const publishingState = $get(state, 'ui.tabs.active.workspace.publishingState');
    const publishableNodes = $get(publishingState, 'publishableNodes');
    const publishableNodesInDocument = $get(publishingState, 'publishableNodesInDocument');
    const isSaving = $get(state, 'ui.remote.isSaving');
    const isPublishing = $get(state, 'ui.remote.isPublishing');
    const isDiscarding = $get(state, 'ui.remote.isDiscarding');
    const isAutoPublishingEnabled = $get(state, 'user.settings.isAutoPublishingEnabled');

    return {
        isSaving,
        isPublishing,
        isDiscarding,
        publishableNodes,
        publishableNodesInDocument,
        isAutoPublishingEnabled
    };
}, {
    toggleAutoPublishing: actions.User.Settings.toggleAutoPublishing
})
export default class PublishDropDown extends Component {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        publishableNodes: PropTypes.instanceOf(Immutable.List),
        publishableNodesInDocument: PropTypes.instanceOf(Immutable.List),
        isAutoPublishingEnabled: PropTypes.bool,
        toggleAutoPublishing: PropTypes.func.isRequired
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
        const canPublishGlobally = publishableNodes.count() > 0;
        const autoPublishWrapperClassNames = mergeClassNames({
            [style.dropDown__item]: true,
            [style['dropDown__item--noHover']]: true
        });
        const {mainButtonLabel, mainButtonTarget} = this.getMainButtonLabeling();
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['btn--highlighted']]: canPublishGlobally
        });

        return (
            <div className={style.wrapper}>
                <AbstractButton
                    className={style.publishBtn}
                    isEnabled={canPublishLocally || isSaving}
                    isHighlighted={canPublishLocally || isSaving}
                    indicator={publishableNodesInDocument.count()}
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
                                indicator={publishableNodes.count()}
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
                                indicator={publishableNodesInDocument.count()}
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
                                indicator={publishableNodes.count()}
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
        const {publishableNodesInDocument} = this.props;
        const {publishingService} = backend;

        publishingService.publishNodes($mapGet(publishableNodesInDocument, 'contextPath'), 'live');
    }

    onPublishAllClick() {
        const {publishableNodes} = this.props;
        const {publishingService} = backend;

        publishingService.publishNodes($mapGet(publishableNodes, 'contextPath'), 'live');
    }

    onDiscardClick() {
        const {publishableNodesInDocument} = this.props;
        const {publishingService} = backend;

        publishingService.discardNodes($mapGet(publishableNodesInDocument, 'contextPath'));
    }

    onDiscardAllClick() {
        const {publishableNodes} = this.props;
        const {publishingService} = backend;

        publishingService.discardNodes($mapGet(publishableNodes, 'contextPath'));
    }
}
