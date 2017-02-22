import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.UI.PageTree.getFocused(state),
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
        canBePasted: PropTypes.func.isRequired,
        focusedNodeContextPath: PropTypes.string,
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
            focusedNodeContextPath,
            clipboardNodeContextPath,
            nodeTypesRegistry
        } = this.props;
        const isDisabled = !canBePasted(clipboardNodeContextPath, focusedNodeContextPath, nodeTypesRegistry);

        return (
            <IconButton
                isDisabled={isDisabled}
                className={className}
                icon="paste"
                onClick={this.handlePasteButtonClick}
                hoverStyle="clean"
                />
        );
    }

    pasteClipBoardNode() {
        const {pasteNode, focusedNodeContextPath} = this.props;

        pasteNode(focusedNodeContextPath);
    }
}
