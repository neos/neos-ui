import React, {PropTypes, PureComponent} from 'react';
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
    i18nRegistry: globalRegistry.get('@neos-project/neos-ui-i18n')
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

        const identifier = $get('identifier', node);
        const creationDateTime = $get('properties._creationDateTime', node);
        const lastModificationDateTime = $get('properties._lastModificationDateTime', node);
        const lastPublicationDateTime = $get('properties._lastPublicationDateTime', node);
        const path = $get('properties._path', node);
        const name = $get('properties._name', node) ? $get('properties._name', node) : '/';

        return (
            <ul className={style.nodeInfoView}>
                <li><span>{i18nRegistry.translate('created', 'Created', {}, 'Neos.Neos')}</span> {creationDateTime}</li>
                <li><span>{i18nRegistry.translate('lastModification', 'Last modification', {}, 'Neos.Neos')}</span> {lastModificationDateTime}</li>
                <li><span>{i18nRegistry.translate('lastPublication', 'Last publication', {}, 'Neos.Neos')}</span> {lastPublicationDateTime}</li>
                <li><span>{i18nRegistry.translate('identifier', 'Identifier', {}, 'Neos.Neos')}</span> {identifier}</li>
                <li title={path}><span>{i18nRegistry.translate('name', 'Name', {}, 'Neos.Neos')}</span> {name}</li>
            </ul>
        );
    }
}
