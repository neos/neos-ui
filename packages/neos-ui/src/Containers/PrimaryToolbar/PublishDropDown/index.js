/* eslint-disable complexity */
import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import Badge from '@neos-project/react-ui-components/src/Badge/';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';

import I18n from '@neos-project/neos-ui-i18n';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

const {publishableNodesSelector, publishableNodesInDocumentSelector, baseWorkspaceSelector, isWorkspaceReadOnlySelector, personalWorkspaceNameSelector} = selectors.CR.Workspaces;

import AbstractButton from './AbstractButton/index';
import WorkspaceSelector from './WorkspaceSelector/index';
import style from './style.module.css';

@connect(state => ({
    isSaving: state?.ui?.remote?.isSaving,
    isPublishing: state?.ui?.remote?.isPublishing,
    isDiscarding: state?.ui?.remote?.isDiscarding,
    publishableNodes: publishableNodesSelector(state),
    publishableNodesInDocument: publishableNodesInDocumentSelector(state),
    personalWorkspaceName: personalWorkspaceNameSelector(state),
    baseWorkspace: baseWorkspaceSelector(state),
    isWorkspaceReadOnly: isWorkspaceReadOnlySelector(state)
}), {
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
        publishAction: PropTypes.func.isRequired,
        discardAction: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired,
        routes: PropTypes.object,
        i18nRegistry: PropTypes.object.isRequired
    };

    handlePublishClick = () => {
        const {publishableNodesInDocument, publishAction, baseWorkspace} = this.props;

        publishAction(publishableNodesInDocument.map(node => node?.contextPath), baseWorkspace);
    }

    handlePublishAllClick = () => {
        const {publishableNodes, publishAction, baseWorkspace} = this.props;

        publishAction(publishableNodes.map(node => node?.contextPath), baseWorkspace);
    }

    handleDiscardClick = () => {
        const {publishableNodesInDocument, discardAction} = this.props;

        discardAction(publishableNodesInDocument.map(node => node?.contextPath));
    }

    handleDiscardAllClick = () => {
        const {publishableNodes, discardAction} = this.props;

        discardAction(publishableNodes.map(node => node?.contextPath));
    }

    render() {
        const {
            publishableNodes,
            publishableNodesInDocument,
            isSaving,
            isPublishing,
            isDiscarding,
            isWorkspaceReadOnly,
            baseWorkspace,
            changeBaseWorkspaceAction,
            i18nRegistry,
            neos
        } = this.props;

        const workspaceModuleUri = neos?.routes?.core?.modules?.workspaces;
        const allowedWorkspaces = neos?.configuration?.allowedTargetWorkspaces;
        const baseWorkspaceTitle = allowedWorkspaces?.[baseWorkspace]?.title;
        const canPublishLocally = !isSaving && !isPublishing && !isDiscarding && publishableNodesInDocument && (publishableNodesInDocument.length > 0);
        const canPublishGlobally = !isSaving && !isPublishing && !isDiscarding && publishableNodes && (publishableNodes.length > 0);
        const changingWorkspaceAllowed = !canPublishGlobally;
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
    }
}
