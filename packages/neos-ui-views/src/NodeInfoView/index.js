import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import style from './style.css';

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
            created: $get('properties._creationDateTime', node),
            lastModification: $get('properties._lastModificationDateTime', node),
            lastPublication: $get('properties._lastPublicationDateTime', node),
            path: $get('properties._path', node),
            name: $get('properties._name', node) ? $get('properties._name', node) : '/'
        };

        return (
            <ul className={style.nodeInfoView}>
                <li><span>{i18nRegistry.translate('created', 'Created', {}, 'Neos.Neos')}</span> {new Date(properties.created).toLocaleString()}</li>
                <li><span>{i18nRegistry.translate('lastModification', 'Last modification', {}, 'Neos.Neos')}</span> {new Date(properties.lastModification).toLocaleString()}</li>
                {properties.lastPublication ? <li><span>{i18nRegistry.translate('lastPublication', 'Last publication', {}, 'Neos.Neos')}</span> {new Date(properties.lastPublication).toLocaleString()}</li> : []}
                <li><span>{i18nRegistry.translate('identifier', 'Identifier', {}, 'Neos.Neos')}</span> {properties.identifier}</li>
                <li title={properties.path}><span>{i18nRegistry.translate('name', 'Name', {}, 'Neos.Neos')}</span> {properties.name}</li>
            </ul>
        );
    }
}
