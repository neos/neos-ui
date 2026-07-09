import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from '@neos-project/neos-ui-i18n';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {Button, Icon} from '@neos-project/react-ui-components';
import {InsertPosition} from '@neos-project/neos-ts-interfaces';
import {neos} from '@neos-project/neos-ui-decorators';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const isAllowedToAddChildOrSiblingNodesSelector = selectors.CR.Nodes.makeIsAllowedToAddChildOrSiblingNodes(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
        const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(focusedNodeContextPath);
        const focusedNode = getNodeByContextPathSelector(state);

        const role = focusedNode ? (nodeTypesRegistry.hasRole(focusedNode.nodeType, 'document') ? 'document' : 'content') : null;
        const isAllowedToAddChildOrSiblingNodes = isAllowedToAddChildOrSiblingNodesSelector(state, {
            reference: focusedNodeContextPath,
            role
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
        insertPosition: PropTypes.string,
        commenceNodeCreation: PropTypes.func.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            contextPath,
            fusionPath,
            insertPosition
        } = this.props;

        commenceNodeCreation(contextPath, fusionPath, insertPosition);
    }

    render() {
        const {isAllowedToAddChildOrSiblingNodes, className, insertPosition} = this.props;
        const insertPositionIcon = insertPosition === InsertPosition.BEFORE
            ? 'arrow-up' : (insertPosition === InsertPosition.AFTER ? 'arrow-down' : 'arrow-right');

        return (
            <Button
                id="neos-InlineToolbar-AddNode"
                className={className}
                disabled={!isAllowedToAddChildOrSiblingNodes}
                onClick={this.handleCommenceNodeCreation}
                title={translate('Neos.Neos.Ui:Main:createNew')}
                size="small"
                style="brand"
            >
                <span className="fa-layers fa-fw">
                    <Icon
                        icon="plus"
                        size="sm"
                    />
                    <Icon icon="circle" color="primaryBlue" transform="shrink-3 down-10 right-10"/>
                    <Icon icon={insertPositionIcon} transform="shrink-7 down-10 right-10"/>
                </span>
            </Button>
        );
    }
}
