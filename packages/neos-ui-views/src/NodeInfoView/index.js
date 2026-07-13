import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {selectors} from '@neos-project/neos-ui-redux-store';
import {IconButton} from '@neos-project/react-ui-components';
import {showFlashMessage} from '@neos-project/neos-ui-error';
import style from './style.module.css';
import {translate} from '@neos-project/neos-ui-i18n';

@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}))
export default class NodeInfoView extends PureComponent {
    static propTypes = {
        commit: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
        getNodeByContextPath: PropTypes.func.isRequired
    }

    nodeTypeNameRef = React.createRef();

    copyNodeToClipboard = () => {
        this.nodeTypeNameRef.current.select();
        const result = document.execCommand('copy');

        if (result) {
            showFlashMessage({
                id: 'copiedToClipboard',
                message: 'Copied nodetype to clipboard',
                severity: 'success'
            });
        } else {
            showFlashMessage({
                id: 'copiedToClipboardFailed',
                message: 'Could not copy to clipboard',
                severity: 'error'
            });
        }
    }

    render() {
        const {focusedNodeContextPath, getNodeByContextPath} = this.props;

        const node = getNodeByContextPath(focusedNodeContextPath);
        const properties = {
            identifier: node?.identifier,
            created: node?.creationDateTime,
            lastModification: node?.lastModificationDateTime,
            lastPublication: node?.lastPublicationDateTime,
            nodeAddress: node?.contextPath,
            name: node?.name
        };

        const nodeType = node?.nodeType;
        // Insert word breaking tags to make the node type more readable
        const wrappingNodeTypeName = nodeType?.replace(/([:.])/g, '<wbr/>$1');

        return (
            <ul className={style.nodeInfoView}>
                <li className={style.nodeInfoView__item} title={new Date(properties.created).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeInfoView.created', 'Created')}</div>
                    <NodeInfoViewContent>{new Date(properties.created).toLocaleString()}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={new Date(properties.lastModification).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeInfoView.lastModification', 'Last modification')}</div>
                    <NodeInfoViewContent>{properties.lastModification ? new Date(properties.lastModification).toLocaleString() : translate('Neos.Neos.Ui:Main:unavailable', 'unavailable')}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={new Date(properties.lastPublication).toLocaleString()}>
                    <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeInfoView.lastPublication', 'Last publication')}</div>
                    <NodeInfoViewContent>{properties.lastPublication ? new Date(properties.lastPublication).toLocaleString() : translate('Neos.Neos.Ui:Main:unavailable', 'unavailable')}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.identifier}>
                    <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeInfoView.identifier', 'Identifier')}</div>
                    <NodeInfoViewContent>{properties.identifier}</NodeInfoViewContent>
                </li>
                <li className={style.nodeInfoView__item} title={properties.nodeAddress}>
                    <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeAddress', 'Node Address')}</div>
                    <NodeInfoViewContent>{properties.nodeAddress}</NodeInfoViewContent>
                </li>
                {properties.name ? (
                    <li className={style.nodeInfoView__item} title={properties.name}>
                        <div className={style.nodeInfoView__title}>{translate('Neos.Neos.Ui:Main:nodeInfoView.name', 'Name')}</div>
                        <NodeInfoViewContent>{properties.name ?? translate('Neos.Neos.Ui:Main:unavailable', 'unavailable')}</NodeInfoViewContent>
                    </li>
                ) : ''}
                <li className={style.nodeInfoView__item} title={nodeType}>
                    <div
                        className={style.nodeInfoView__title}>{translate('Neos.Neos:Main:type', 'Type')}</div>
                    <textarea ref={this.nodeTypeNameRef} className={style.nodeInfoView__nodeTypeTextarea} value={nodeType} readOnly></textarea>
                    <NodeInfoViewContent>
                        <span dangerouslySetInnerHTML={{__html: wrappingNodeTypeName}}></span>
                    </NodeInfoViewContent>
                    <IconButton
                        className={style.nodeInfoView__copyButton}
                        icon="copy"
                        title={translate('Neos.Neos.Ui:Main:copyNodeTypeNameToClipboard', 'Copy node type to clipboard')}
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
