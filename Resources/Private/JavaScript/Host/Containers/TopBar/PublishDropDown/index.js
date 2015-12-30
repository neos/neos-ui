import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import Immutable from 'immutable';
import {I18n, Icon, DropDown} from '../../../Components/';
import style from './style.css';
import Button from './Button/';

import {backend} from '../../../Service/';

@connect(state => {
    const workspaceInfo = state.get('ui').get('tabs').get('active').get('workspace');
    const publishableNodes = workspaceInfo.get('publishableNodes');
    const publishableNodesInDocument = workspaceInfo.get('publishableNodesInDocument');

    return {
        publishableNodes,
        publishableNodesInDocument
    };
})
export default class PublishDropDown extends Component {
    static propTypes = {
        publishableNodes: PropTypes.instanceOf(Immutable.List),
        publishableNodesInDocument: PropTypes.instanceOf(Immutable.List)
    }

    render() {
        const {publishableNodes, publishableNodesInDocument} = this.props;
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

        return (
            <div className={style.wrapper}>
                <Button
                    style={style}
                    cavity={true}
                    enabled={canPublishLocally}
                    highlighted={canPublishLocally}
                    indicator={publishableNodesInDocument.count()}
                    label={canPublishLocally ? 'Publish' : 'Published'}
                    onClick={(e) => this.onPublishClick(e)}
                />
                <DropDown iconAfter="chevron-down" iconAfterActive="chevron-up" classNames={dropDownClassNames}>
                    <li className={style.dropDown__contents__item}>
                        <Button
                            style={style}
                            cavity={false}
                            enabled={canPublishGlobally}
                            highlighted={false}
                            indicator={publishableNodes.count()}
                            label="Publish All"
                            icon="upload"
                            onClick={(e) => this.onPublishAllClick(e)}
                        />
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
                        />
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <Button
                            style={style}
                            cavity={false}
                            enabled={canPublishGlobally}
                            highlighted={false}
                            indicator={publishableNodes.count()}
                            label="Discard All"
                            icon="ban"
                            onClick={(e) => this.onDiscardAllClick(e)}
                        />
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <label>
                            <input type="checkbox" onChange={this.onAutoPublishChange.bind(this)} />
                            <I18n target="Auto-Publish" />
                        </label>
                    </li>
                    <li className={style.dropDown__contents__item}>
                        <a href="/neos/management/workspaces">
                            <Icon icon="th-large" />
                            <I18n target="Workspaces" />
                        </a>
                    </li>
                </DropDown>
            </div>
        );
    }

    renderLocalPublishLabel(publishableNodesInDocument) {
        const canPublish = publishableNodesInDocument.count() > 0;

        if (canPublish) {
            return (<span>
                <I18n target="Publish" /> ({publishableNodesInDocument.count()})
            </span>);
        }

        return (<span>
            <I18n target="Published" />
        </span>);
    }

    onPublishClick() {
        const {publishableNodesInDocument} = this.props;
        const {publishingService} = backend;

        publishingService.publishNodes(publishableNodesInDocument.map(n => n.contextPath || n.get('contextPath')), 'live');
    }

    onPublishAllClick() {
        const {publishableNodes} = this.props;
        const {publishingService} = backend;

        publishingService.publishNodes(publishableNodes.map(n => n.contextPath || n.get('contextPath')), 'live');
    }

    onDiscardClick() {
        const {publishableNodesInDocument} = this.props;
        const {publishingService} = backend;

        publishingService.discardNodes(publishableNodesInDocument.map(n => n.contextPath || n.get('contextPath')));
    }

    onDiscardAllClick() {
        const {publishableNodes} = this.props;
        const {publishingService} = backend;

        publishingService.discardNodes(publishableNodes.map(n => n.contextPath || n.get('contextPath')));
    }

    onAutoPublishChange(e) {
        console.log('auto publish changed', e);
    }
}
