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

    return state => {
        const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
        const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
            reference: focusedNodeContextPath
        });

        return {
            isAllowedToAddChildOrSiblingNodes
        };
    };
}, {
    commenceNodeCreation: actions.CR.Nodes.commenceCreation
})
export default class AddNode extends PureComponent {
    static propTypes = {
        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        className: PropTypes.string,
        commenceNodeCreation: PropTypes.func.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool,
        i18nRegistry: PropTypes.object.isRequired
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            contextPath,
            fusionPath
        } = this.props;

        commenceNodeCreation(contextPath, fusionPath);
    }

    render() {
        const {isAllowedToAddChildOrSiblingNodes, i18nRegistry} = this.props;

        return (
            <IconButton
                id="neos-InlineToolbar-AddNode"
                disabled={!isAllowedToAddChildOrSiblingNodes}
                className={this.props.className}
                icon="plus"
                onClick={this.handleCommenceNodeCreation}
                hoverStyle="brand"
                title={i18nRegistry.translate('createNew')}
                />
        );
    }
}
