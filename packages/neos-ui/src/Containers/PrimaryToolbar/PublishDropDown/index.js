/* eslint-disable complexity */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {Badge, Icon, DropDown} from '@neos-project/react-ui-components';

import I18n, {translate} from '@neos-project/neos-ui-i18n';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {neos} from '@neos-project/neos-ui-decorators';

const {publishableNodesSelector, publishableNodesInDocumentSelector, baseWorkspaceSelector, isWorkspaceReadOnlySelector, personalWorkspaceNameSelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import WorkspaceSelector from './WorkspaceSelector/index';
import style from './style.module.css';

@connect(state => ({
    isSaving: state?.ui?.remote?.isSaving,
    isPublishing: state?.cr?.publishing?.mode === PublishingMode.PUBLISH,
    publishableNodes: publishableNodesSelector(state),
    publishableNodesInDocument: publishableNodesInDocumentSelector(state),
    personalWorkspaceName: personalWorkspaceNameSelector(state),
    baseWorkspace: baseWorkspaceSelector(state),
    isWorkspaceReadOnly: isWorkspaceReadOnlySelector(state)
}), {
    changeBaseWorkspaceAction: actions.CR.Workspaces.changeBaseWorkspace,
    start: actions.CR.Publishing.start
})
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

export default class PublishDropDown extends PureComponent {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isWorkspaceReadOnly: PropTypes.bool,
        publishableNodes: PropTypes.array,
        publishableNodesInDocument: PropTypes.array,
        personalWorkspaceName: PropTypes.string.isRequired,
        baseWorkspace: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        start: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        routes: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired
    };

    handlePublishClick = () => {
        const {start} = this.props;
        start(PublishingMode.PUBLISH, PublishingScope.DOCUMENT, false);
    }

    handlePublishAllClick = () => {
        const {start} = this.props;
        start(PublishingMode.PUBLISH, PublishingScope.SITE, true);
    }

    handleDiscardClick = () => {
        const {start} = this.props;
        start(PublishingMode.DISCARD, PublishingScope.DOCUMENT, true);
    }

    handleDiscardAllClick = () => {
        const {start} = this.props;
        start(PublishingMode.DISCARD, PublishingScope.SITE, true);
    }

    render() {
        const {
            publishableNodes,
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isWorkspaceReadOnly,
            baseWorkspace,
            changeBaseWorkspaceAction,
            i18nRegistry,
            neos
        } = this.props;

        const workspaceModuleUri = neos?.routes?.core?.modules?.workspace;
        const allowedWorkspaces = neos?.configuration?.allowedTargetWorkspaces;
        const baseWorkspaceTitle = allowedWorkspaces?.[baseWorkspace]?.title;
        const canPublishLocally = !isSaving && !isPublishing && publishableNodesInDocument && (publishableNodesInDocument.length > 0);
        const canPublishGlobally = !isSaving && !isPublishing && publishableNodes && (publishableNodes.length > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
        const mainButton = this.getTranslatedMainButton(baseWorkspaceTitle);
        const dropDownBtnClassName = mergeClassNames({
            [style.dropDown__btn]: true,
            [style['dropDown__item--canPublish']]: canPublishGlobally,
            [style['dropDown__item--isPublishing']]: isPublishing,
            [style['dropDown__item--isSaving']]: isSaving
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
                    {isPublishing || isSaving ? (
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
                            <a id="neos-PublishDropDown-ReviewChanges" href={workspaceModuleUri + '/review?moduleArguments[workspace]=' + this.props.personalWorkspaceName}>
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="check-circle"/>
                                </div>
                                <I18n id="Neos.Neos:Main:reviewChanges" fallback="Review changes"/>
                            </a>
                        </li>)}
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
            isPublishing
        } = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.length > 0);

        if (isSaving) {
            return translate('Neos.Neos:Main:saving', 'saving');
        }

        if (isPublishing) {
            return translate('Neos.Neos:Main:publishTo', 'Publish to {0}', [baseWorkspaceTitle]) + ' ...';
        }

        if (canPublishLocally) {
            return translate('Neos.Neos:Main:publishTo', 'Publish to {0}', [baseWorkspaceTitle]);
        }

        return translate('Neos.Neos:Main:published', 'Published') + (baseWorkspaceTitle ? ' - ' + baseWorkspaceTitle : '');
    }
}
