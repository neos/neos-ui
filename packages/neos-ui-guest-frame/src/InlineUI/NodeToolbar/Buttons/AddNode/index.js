import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from '@neos-project/neos-ui-i18n';
import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {Button, Icon} from '@neos-project/react-ui-components';
import {InsertPosition} from '@neos-project/neos-ts-interfaces';
import {neos} from '@neos-project/neos-ui-decorators';

import getInsertPositionIcon from '../getInsertPositionIcon';

//
// Determine the button label from the relative insert position the new node
// will actually end up in
//
const getCreateTitle = (insertPosition, creationReference, insertsBelowExistingContent) => {
    if (creationReference) {
        // The new node will be placed at the very top of the referenced collection
        return translate('Neos.Neos.Ui:Main:createNewAtTop', 'Create new at the top');
    }

    switch (insertPosition) {
        case InsertPosition.BEFORE:
            return translate('Neos.Neos.Ui:Main:createNewAbove', 'Create new above');

        case InsertPosition.AFTER:
            return translate('Neos.Neos.Ui:Main:createNewBelow', 'Create new below');

        default:
            // An "into" insertion is appended after the last child - so with existing
            // content it lands below it, while an empty collection has nothing below
            return insertsBelowExistingContent
                ? translate('Neos.Neos.Ui:Main:createNewAtBottom', 'Create new at the bottom')
                : translate('Neos.Neos.Ui:Main:createNewInside', 'Create new inside');
    }
};

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
        creationReference: PropTypes.object,
        creationInsertPosition: PropTypes.string,
        insertsBelowExistingContent: PropTypes.bool,
        commenceNodeCreation: PropTypes.func.isRequired,
        isAllowedToAddChildOrSiblingNodes: PropTypes.bool
    };

    handleCommenceNodeCreation = () => {
        const {
            commenceNodeCreation,
            contextPath,
            fusionPath,
            insertPosition,
            creationReference,
            creationInsertPosition
        } = this.props;

        if (creationReference) {
            // Insert relative to the referenced node instead, e.g. before the first child
            // of a content collection to place the new node at the very top of it
            commenceNodeCreation(creationReference.contextPath, creationReference.fusionPath, creationInsertPosition);
            return;
        }

        commenceNodeCreation(contextPath, fusionPath, insertPosition);
    }

    render() {
        const {
            isAllowedToAddChildOrSiblingNodes,
            className,
            insertPosition,
            creationReference,
            insertsBelowExistingContent
        } = this.props;
        const insertPositionIcon = getInsertPositionIcon(insertPosition, creationReference, insertsBelowExistingContent);
        const title = getCreateTitle(insertPosition, creationReference, insertsBelowExistingContent);

        return (
            <Button
                id="neos-InlineToolbar-AddNode"
                className={className}
                disabled={!isAllowedToAddChildOrSiblingNodes}
                onClick={this.handleCommenceNodeCreation}
                title={title}
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
