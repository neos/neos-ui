import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = $get('cr.nodes.focused.contextPath', state);
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
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool
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
        const {isAllowedToAddChildOrSiblingNodes} = this.props;

        return (
            <span>
                <IconButton
                    isDisabled={!isAllowedToAddChildOrSiblingNodes}
                    className={this.props.className}
                    icon="plus"
                    tooltipLabel="Create New"
                    onClick={this.handleCommenceNodeCreation}
                    hoverStyle="clean"
                    />
            </span>
        );
    }
}
