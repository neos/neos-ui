import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';
import {translate} from '@neos-project/neos-ui-i18n';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';
import {InsertPosition} from '@neos-project/neos-ts-interfaces';
import {Button, Icon} from '@neos-project/react-ui-components';

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

        return {canBePasted};
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

        pasteNode: PropTypes.func.isRequired
    };

    handlePasteButtonClick = () => {
        const {pasteNode, contextPath, fusionPath, insertPosition} = this.props;
        pasteNode(contextPath, fusionPath, insertPosition);
    }

    render() {
        const {className, canBePasted, insertPosition} = this.props;

        // FIXME: Also hide/disable button if insertPosition is invalid for the current node
        if (!canBePasted) {
            return null;
        }

        const insertPositionIcon = insertPosition === InsertPosition.BEFORE
            ? 'arrow-up' : (insertPosition === InsertPosition.AFTER ? 'arrow-down' : 'arrow-right');

        return (
            <Button
                id="neos-InlineToolbar-PaseClipBoardNode"
                className={className}
                onClick={this.handlePasteButtonClick}
                title={translate('Neos.Neos.Ui:Main:paste')}
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
