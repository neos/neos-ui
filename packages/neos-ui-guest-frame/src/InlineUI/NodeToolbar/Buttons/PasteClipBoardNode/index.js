import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';

import IconButton from '@neos-project/react-ui-components/src/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const canBePastedSelector = selectors.CR.Nodes.makeCanBePastedSelector(nodeTypesRegistry);

    return (state, {contextPath}) => {
        const clipboardNodesContextPaths = selectors.CR.Nodes.clipboardNodesContextPathsSelector(state);
        const canBePasted = (clipboardNodesContextPaths.every(clipboardNodeContextPath => {
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

        pasteNode: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired
    };

    handlePasteButtonClick = () => {
        const {pasteNode, contextPath, fusionPath} = this.props;

        pasteNode(contextPath, fusionPath);
    }

    render() {
        const {className, canBePasted, i18nRegistry} = this.props;

        if (!canBePasted) {
            return null;
        }

        return (
            <IconButton
                id="neos-InlineToolbar-PaseClipBoardNode"
                className={className}
                icon="paste"
                onClick={this.handlePasteButtonClick}
                hoverStyle="brand"
                title={i18nRegistry.translate('paste')}
                />
        );
    }
}
