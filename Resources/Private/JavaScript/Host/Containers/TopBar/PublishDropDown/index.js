import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Immutable from 'immutable';
import {I18n, Icon, DropDown} from '../../../Components/';
import style from './style.css';
import Button from './Button/';

import {backend} from '../../../Service/';
import {immutableOperations} from '../../../../Shared/Util';

const {$get, $mapGet} = immutableOperations;

@connect(state => {
    const publishingState = $get(state, 'ui.tabs.active.workspace.publishingState');
    const publishableNodes = $get(publishingState, 'publishableNodes');
    const publishableNodesInDocument = $get(publishingState, 'publishableNodesInDocument');
    const isSaving = $get(state, 'ui.remote.isSaving');
    const isPublishing = $get(state, 'ui.remote.isPublishing');
    const isDiscarding = $get(state, 'ui.remote.isDiscarding');

    return {
        isSaving,
        isPublishing,
        isDiscarding,
        publishableNodes,
        publishableNodesInDocument
    };
})
export default class PublishDropDown extends Component {
    static propTypes = {
        isSaving: PropTypes.bool,
        isPublishing: PropTypes.bool,
        isDiscarding: PropTypes.bool,
        publishableNodes: PropTypes.instanceOf(Immutable.List),
        publishableNodesInDocument: PropTypes.instanceOf(Immutable.List)
    }

    render() {
        const {publishableNodes, publishableNodesInDocument, isSaving} = this.props;
        const canPublishLocally = publishableNodesInDocument && (publishableNodesInDocument.count() > 0);
        const canPublishGlobally = publishableNodes.count() > 0;
        const dropDownClassNames = {
            wrapper: style.dropDown,
            btn: mergeClassNames({
                [style.btn]: true,
                [style.dropDown__btn]: true,
                [style['btn--highlighted']]: canPublishGlobally
            }),
            ['btn--active']: style['dropDown__btn--active'],
            contents: style.dropDown__contents
        };
        const {mainButtonLabel,mainButtonTarget} = this.getMainButtonLabeling();

        return (
            <div className={style.wrapper}>
                <Button
                    style={style}
                    cavity={true}
                    enabled={canPublishLocally || isSaving}
                    highlighted={canPublishLocally || isSaving}
                    indicator={publishableNodesInDocument.count()}
                    onClick={(e) => this.onPublishClick(e)}
                >
                    <I18n target={mainButtonTarget} id={mainButtonLabel} />
                </Button>
                <DropDown iconAfter="chevron-down" iconAfterActive="chevron-up" classNames={dropDownClassNames}>
                    <li className={style.dropDown__contents__item}>
                        <Button
                            style={style}
                            cavity={false}
                            enabled={canPublishGlobally}
                            highlighted={false}
                            indicator={publishableNodes.count()}
                            onClick={(e) => this.onPublishAllClick(e)}
                        >
                            <Icon icon="upload" />
                            <I18n target="Publish All" id="publishAll" />
                        </Button>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <Button
                            style={style}
                            cavity={false}
                            enabled={canPublishLocally}
                            highlighted={false}
                            indicator={publishableNodesInDocument.count()}
                            label="Discard"
                            icon="ban"
                            onClick={(e) => this.onDiscardClick(e)}
                        >
                            <Icon icon="ban" />
                            <I18n target="Discard" id="discard" />
                        </Button>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <Button
                            style={style}
                            cavity={false}
                            enabled={canPublishGlobally}
                            highlighted={false}
                            indicator={publishableNodes.count()}
                            onClick={(e) => this.onDiscardAllClick(e)}
                        >
                            <Icon icon="ban" />
                            <I18n target="Discard All" id="discardAll" />
                        </Button>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <label>
                            <input type="checkbox" onChange={this.onAutoPublishChange.bind(this)} />
                            <I18n target="Auto-Publish" id="autoPublish" />
                        </label>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <a href="/neos/management/workspaces">
                            <Icon icon="th-large" />
                            <I18n target="Workspaces" id="workspaces" />
                        </a>
                    </li>
                </DropDown>
            </div>
        );
    }

    getMainButtonLabeling() {
        const {publishableNodesInDocument, isSaving, isPublishing, isDiscarding} = this.props;
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

    onAutoPublishChange(e) {
        console.log('auto publish changed', e);
    }
}
