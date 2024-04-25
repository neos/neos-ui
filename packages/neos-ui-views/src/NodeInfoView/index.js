import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';
import {selectors} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';
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

    nodeTypeNameRef = React.createRef();

    copyNodeToClipboard = () => {
        this.nodeTypeNameRef.current.select();
        const result = document.execCommand('copy');

        if (result) {
            this.props.addFlashMessage('copiedToClipboard', 'Copied nodetype to clipboard', 'success');
        } else {
            this.props.addFlashMessage('copiedToClipboardFailed', 'Could not copy to clipboard', 'error');
        }
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

        const nodeType = $get('nodeType', node);
        // Insert word breaking tags to make the node type more readable
        const wrappingNodeTypeName = nodeType?.replace(/([:.])/g, '<wbr/>$1');

        return (
            <ul className={style.nodeInfoView}>
                <li className={style.nodeInfoView__item} title={new Date(properties.created).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('created', 'Created', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{new Date(properties.created).toLocaleString()}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={new Date(properties.lastModification).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('lastModification', 'Last modification', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{new Date(properties.lastModification).toLocaleString()}</NodeInfoViewContent>
                </li>
                {properties.lastPublication ? (<li className={style.nodeInfoView__item} title={new Date(properties.lastPublication).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('lastPublication', 'Last publication', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{new Date(properties.lastPublication).toLocaleString()}</NodeInfoViewContent>
                </li>) : []}
                <li className={style.nodeInfoView__item} title={properties.identifier}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('identifier', 'Identifier', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.identifier}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.path}>
                    <div className={style.nodeInfoView__title}>{i18nRegistry.translate('name', 'Name', {}, 'Neos.Neos')}</div>
                    <NodeInfoViewContent>{properties.name}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={nodeType}>
                    <div
                        className={style.nodeInfoView__title}>{i18nRegistry.translate('type', 'Type', {}, 'Neos.Neos')}</div>
                    <textarea ref={this.nodeTypeNameRef} className={style.nodeInfoView__nodeTypeTextarea}>{nodeType}</textarea>
                    <NodeInfoViewContent>
                        <span dangerouslySetInnerHTML={{__html: wrappingNodeTypeName}}></span>
                    </NodeInfoViewContent>
                    <IconButton
                        className={style.nodeInfoView__copyButton}
                        icon="copy"
                        title={i18nRegistry.translate('copyNodeTypeNameToClipboard', 'Copy node type to clipboard', {}, 'Neos.Neos.Ui')}
                        onClick={this.copyNodeToClipboard}
                    />
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
