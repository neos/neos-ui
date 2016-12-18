import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    clipboardNodeContextPath: selectors.CR.Nodes.clipboardNodeContextPathSelector(state),
    canBePasted: selectors.CR.Nodes.canBePastedSelector(state)
}), {
    pasteNode: actions.CR.Nodes.paste
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        canBePasted: PropTypes.bool,

        contextPath: PropTypes.string,
        fusionPath: PropTypes.string,

        clipboardNodeContextPath: PropTypes.string,
        nodeTypesRegistry: PropTypes.object.isRequired,
        pasteNode: PropTypes.func.isRequired
    };

    constructor(...args) {
        super(...args);

        this.handlePasteButtonClick = this.pasteClipBoardNode.bind(this);
    }

    render() {
        const {
            className,
            canBePasted,
            contextPath,
            clipboardNodeContextPath,
            nodeTypesRegistry
        } = this.props;
        const isDisabled = !canBePasted(clipboardNodeContextPath, contextPath, nodeTypesRegistry);

        return (
            <IconButton
                isDisabled={isDisabled}
                className={className}
                icon="paste"
                onClick={this.handlePasteButtonClick}
                />
        );
    }

    pasteClipBoardNode() {
        const {pasteNode, contextPath, fusionPath} = this.props;

        pasteNode(contextPath, fusionPath);
    }
}
