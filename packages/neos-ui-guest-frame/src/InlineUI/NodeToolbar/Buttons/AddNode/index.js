import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);
    const getAllowedChildNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedChildNodeTypesSelector(nodeTypesRegistry);
    const getAllowedSiblingNodeTypesSelector = selectors.CR.Nodes.makeGetAllowedSiblingNodeTypesSelector(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
        const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
            reference: focusedNodeContextPath
        });
        const allowedChildNodeTypes = getAllowedChildNodeTypesSelector(state, {
            reference: focusedNodeContextPath
        });
        const isAllowedToAddChildNodes = Boolean(allowedChildNodeTypes.length);
        const allowedSiblingNodeTypes = getAllowedSiblingNodeTypesSelector(state, {
            reference: focusedNodeContextPath
        });
        const isAllowedToAddSiblingNodes = Boolean(allowedSiblingNodeTypes.length);

        return {
            isAllowedToAddChildOrSiblingNodes,
            isAllowedToAddChildNodes,
            isAllowedToAddSiblingNodes
        };
    };
}, {
    commenceNodeCreation: actions.CR.Nodes.commenceCreation
})
export default class AddNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        preferredMode: PropTypes.string,
        className: PropTypes.string,
        commenceNodeCreation: PropTypes.func.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool,
        isAllowedToAddChildNodes: PropTypes.bool,
        isAllowedToAddSiblingNodes: PropTypes.bool,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            preferredMode,
            contextPath,
            fusionPath
        } = this.props;

        commenceNodeCreation(contextPath, fusionPath, preferredMode);
    }

    isEnabled = () => {
        const {isAllowedToAddChildOrSiblingNodes, isAllowedToAddChildNodes, isAllowedToAddSiblingNodes, preferredMode} = this.props;

        if (preferredMode === 'before' || preferredMode === 'after') {
            return isAllowedToAddSiblingNodes;
        }
        if (preferredMode === 'into') {
            return isAllowedToAddChildNodes;
        }

        return isAllowedToAddChildOrSiblingNodes;
    }

    render() {
        const {i18nRegistry} = this.props;
        const isEnabled = this.isEnabled();

        return isEnabled && (
            <IconButton
                id="neos-InlineToolbar-AddNode"
                disabled={!isEnabled}
                className={this.props.className}
                icon="plus"
                onClick={this.handleCommenceNodeCreation}
                hoverStyle="brand"
                title={i18nRegistry.translate('createNew')}
                />
        );
    }
}
