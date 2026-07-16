/* eslint-disable complexity */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {Badge, Icon, DropDown} from '@neos-project/react-ui-components';

import {translate} from '@neos-project/neos-ui-i18n';
import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {PublishingMode, PublishingScope} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {neos} from '@neos-project/neos-ui-decorators';
import {AbstractButton} from './Components/AbstractButton';
import {PublishButton} from './Components/PublishButton';
import style from './style.module.css';

const {
    publishableNodesSelector,
    publishableNodesInDocumentSelector,
    isWorkspaceReadOnlySelector,
    personalWorkspaceNameSelector
} = selectors.CR.Workspaces;

@connect(state => ({
    isSaving: state?.ui?.remote?.isSaving,
    isPublishing: state?.cr?.publishing?.mode === PublishingMode.PUBLISH,
    publishableNodes: publishableNodesSelector(state),
    publishableNodesInDocument: publishableNodesInDocumentSelector(state),
    personalWorkspaceName: personalWorkspaceNameSelector(state),
    isWorkspaceReadOnly: isWorkspaceReadOnlySelector(state)
}), {
    changeBaseWorkspaceAction: actions.CR.Workspaces.changeBaseWorkspace,
    start: actions.CR.Publishing.start
})
@neos()
export default class PublishDropDown extends PureComponent {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isWorkspaceReadOnly: PropTypes.bool,
        publishableNodes: PropTypes.array,
        publishableNodesInDocument: PropTypes.array,
        personalWorkspaceName: PropTypes.string.isRequired,
        neos: PropTypes.object.isRequired,
        start: PropTypes.func.isRequired,
        changeBaseWorkspaceAction: PropTypes.func.isRequired
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
            neos
        } = this.props;

        const workspaceModuleUri = neos?.routes?.core?.modules?.workspace;
        const canPublishLocally = !isSaving && !isPublishing && publishableNodesInDocument && (publishableNodesInDocument.length > 0);
        const canPublishGlobally = !isSaving && !isPublishing && publishableNodes && (publishableNodes.length > 0);
        const publishButtonLabel = this.getPublishButtonLabel();
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
                <PublishButton
                    id="neos-PublishDropDown-Publish"
                    isEnabled={!isWorkspaceReadOnly && (canPublishLocally)}
                    isHighlighted={canPublishLocally || isSaving || isPublishing}
                    onClick={this.handlePublishClick}
                    >
                    {publishButtonLabel} {isWorkspaceReadOnly ? (<Icon icon="lock"/>) : ''}
                    {publishableNodesInDocumentCount > 0 && <Badge className={style.badge} label={String(publishableNodesInDocumentCount)}/>}
                </PublishButton>

                <DropDown className={style.dropDown}>
                    {isPublishing || isSaving ? (
                        <DropDown.Header
                            iconIsOpen={'spinner'}
                            iconIsClosed={'spinner'}
                            iconRest={{spin: true, transform: 'up-8'}}
                            className={dropDownBtnClassName}
                            disabled
                            aria-label={translate('Neos.Neos.Ui:Main:showPublishOptions', 'Show publishing options')}
                        />
                    ) : (
                        <DropDown.Header
                            className={dropDownBtnClassName}
                            aria-label={translate('Neos.Neos.Ui:Main:showPublishOptions', 'Show publishing options')}
                        />
                    )}
                    <DropDown.Contents className={style.dropDown__contents}>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-PublishAll"
                                isEnabled={!isWorkspaceReadOnly && canPublishGlobally}
                                onClick={this.handlePublishAllClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="check-double"/>
                                </div>
                                {translate('Neos.Neos.Ui:Main:publishAll', 'Publish All')}
                                {publishableNodesCount > 0 && <Badge className={style.badge} label={String(publishableNodesCount)}/>}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-Discard"
                                isEnabled={canPublishLocally}
                                label="Discard"
                                icon="ban"
                                onClick={this.handleDiscardClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="ban"/>
                                </div>
                                {translate('Neos.Neos.Ui:Main:discard', 'Discard')}
                                {publishableNodesInDocumentCount > 0 && <Badge className={style.badge} label={String(publishableNodesInDocumentCount)}/>}
                            </AbstractButton>
                        </li>
                        <li className={style.dropDown__item}>
                            <AbstractButton
                                id="neos-PublishDropDown-DiscardAll"
                                isEnabled={canPublishGlobally}
                                onClick={this.handleDiscardAllClick}
                                >
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="ban"/>
                                </div>
                                {translate('Neos.Neos.Ui:Main:discardAll', 'Discard All')}
                                {publishableNodesCount > 0 && <Badge className={style.badge} label={String(publishableNodesCount)}/>}
                            </AbstractButton>
                        </li>
                        {publishableNodesCount > 0 && (<li className={style.dropDown__item}>
                            <a id="neos-PublishDropDown-ReviewChanges" href={workspaceModuleUri + '/review?moduleArguments[workspace]=' + this.props.personalWorkspaceName}>
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="check-circle"/>
                                </div>
                                {translate('Neos.Neos.Ui:Main:reviewChanges', 'Review changes')}
                            </a>
                        </li>)}
                        <li className={style.dropDown__item}>
                            <a id="neos-PublishDropDown-Workspaces" href={workspaceModuleUri}>
                                <div className={style.dropDown__iconWrapper}>
                                    <Icon icon="layer-group"/>
                                </div>
                                {translate('Neos.Neos.Ui:Main:workspaces', 'Workspaces')}
                            </a>
                        </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }

    getPublishButtonLabel() {
        const {publishableNodesInDocument} = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.length > 0);

        if (canPublishLocally) {
            return translate('Neos.Neos.Ui:Main:publish', 'Publish');
        }

        return translate('Neos.Neos.Ui:Main:published', 'Published');
    }
}
