import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.module.css';

@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}))
@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))
export default class NodeInfoView extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
        getNodeByContextPath: PropTypes.func.isRequired,

        i18nRegistry: PropTypes.object.isRequired
    }

    render() {
        const {focusedNodeContextPath, getNodeByContextPath, i18nRegistry} = this.props;

        const node = getNodeByContextPath(focusedNodeContextPath);
        const properties = {
            identifier: $get('identifier', node),
            created: $get('creationDateTime', node),
            lastModification: $get('lastModificationDateTime', node),
            lastPublication: $get('lastPublicationDateTime', node),
            nodeAddress: $get('nodeAddress', node),
            name: $get('name', node) ? $get('name', node) : '/'
        };

        const nodeType = $get('nodeType', node);

        return (
            <ul className={style.nodeInfoView}>
                <li className={style.nodeInfoView__item} title={new Date(properties.created).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('created', 'Created', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{new Date(properties.created).toLocaleString()}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={new Date(properties.lastModification).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('lastModification', 'Last modification', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.lastModification ? new Date(properties.lastModification).toLocaleString() : i18nRegistry.translate('unavailable', 'unavailable', {}, 'Neos.Neos')}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={new Date(properties.lastPublication).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('lastPublication', 'Last publication', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.lastPublication ? new Date(properties.lastPublication).toLocaleString() : i18nRegistry.translate('unavailable', 'unavailable', {}, 'Neos.Neos')}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.identifier}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('identifier', 'Identifier', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.identifier}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.nodeAddress}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('nodeAddress', 'Node Address', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.nodeAddress}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.name}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('name', 'Name', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.name ?? i18nRegistry.translate('unavailable', 'unavailable', {}, 'Neos.Neos')}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={nodeType}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('type', 'Type', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{nodeType}</NodeInfoViewContent>
                </li>
            </ul>
        );
    }
}

/**
 * Handles the automatic selection of it's content to ease copy&paste
 */
class NodeInfoViewContent extends PureComponent {
    static propTypes = {
        children: PropTypes.node
    };

    handleReference = ref => {
        this.element = ref;
    }

    handleClick = () => {
        if (this.element) {
            window.getSelection().selectAllChildren(this.element);
        }
    }

    render() {
        return (
            <div
                role="button"
                ref={this.handleReference}
                className={style.nodeInfoView__content}
                onClick={this.handleClick}
                >
                {this.props.children}
            </div>
        );
    }
}
