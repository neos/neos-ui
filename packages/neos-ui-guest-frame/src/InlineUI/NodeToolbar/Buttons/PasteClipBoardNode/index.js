import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';
import {translate} from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {InsertPosition} from '@neos-project/neos-ts-interfaces';
import {Button, Icon} from '@neos-project/react-ui-components';

import getInsertPositionIcon from '../getInsertPositionIcon';
import isEmptyContentCollection from '../../isEmptyContentCollection';

//
// Determine the button label from the relative insert position the pasted
// node will actually end up in
//
const createLabelForIntent = (insertPosition, creationReference, isEmptyCollection) => {
    if (creationReference) {
        // The pasted node will be placed at the very top of the referenced collection
        return translate('Neos.Neos.Ui:Main:pasteAtTop', 'Paste at the top');
    }

    switch (insertPosition) {
        case InsertPosition.BEFORE:
            return translate('Neos.Neos.Ui:Main:pasteAbove', 'Paste above');

        case InsertPosition.AFTER:
            return translate('Neos.Neos.Ui:Main:pasteBelow', 'Paste below');

        default:
            // An "into" insertion is appended after the last child - so with existing
            // content it lands below it, while an empty collection has nothing below
            return isEmptyCollection
                ? translate('Neos.Neos.Ui:Main:pasteInside', 'Paste inside')
                : translate('Neos.Neos.Ui:Main:pasteAtBottom', 'Paste at the bottom');
    }
};

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);

    return (state, {contextPath}) => {
        const clipboardNodesContextPaths = selectors.CR.Nodes.clipboardNodesContextPathsSelector(state);
        const canBePasted = Boolean(clipboardNodesContextPaths.length && clipboardNodesContextPaths.every(clipboardNodeContextPath => {
            return canBePastedSelector(state, {
                subject: clipboardNodeContextPath,
                reference: contextPath
            });
        }));
        const focusedNode = selectors.CR.Nodes.makeGetNodeByContextPathSelector(contextPath)(state);

        return {
            canBePasted,
            isEmptyCollection: isEmptyContentCollection(focusedNode, nodeTypesRegistry)
        };
    };
}, {
    pasteNode: actions.CR.Nodes.paste
})
export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        canBePasted: PropTypes.bool,

        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,
        insertPosition: PropTypes.string,
        creationReference: PropTypes.object,
        isEmptyCollection: PropTypes.bool,

        pasteNode: PropTypes.func.isRequired
    };

    handlePasteButtonClick = () => {
        const {pasteNode, contextPath, fusionPath, insertPosition, creationReference} = this.props;

        // Paste relative to the referenced node if one is given - e.g. before the first
        // child of a content collection to place the node at the very top of it
        const target = creationReference ?? {contextPath, fusionPath};

        pasteNode(target.contextPath, target.fusionPath, insertPosition);
    }

    render() {
        const {className, canBePasted, insertPosition, creationReference, isEmptyCollection} = this.props;

        // FIXME: Also hide/disable button if insertPosition is invalid for the current node
        if (!canBePasted) {
            return null;
        }

        const insertPositionIcon = getInsertPositionIcon(insertPosition, creationReference, isEmptyCollection);
        const title = createLabelForIntent(insertPosition, creationReference, isEmptyCollection);

        return (
            <Button
                id="neos-InlineToolbar-PaseClipBoardNode"
                className={className}
                onClick={this.handlePasteButtonClick}
                title={title}
                size="small"
                style="brand"
            >
                <span className="fa-layers fa-fw">
                    <Icon icon="paste" size="sm"/>
                    <Icon icon="circle" color="primaryBlue" transform="shrink-3 down-10 right-10"/>
                    <Icon icon={insertPositionIcon} transform="shrink-7 down-10 right-10"/>
                </span>
            </Button>
        );
    }
}
