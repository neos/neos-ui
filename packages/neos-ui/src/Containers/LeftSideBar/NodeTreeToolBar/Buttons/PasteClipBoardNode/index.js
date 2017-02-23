import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {neos} from '@neos-project/neos-ui-decorators';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
@connect((state, {nodeTypesRegistry}) => {
    const canBePastedSelector = selectors.CR.Nodes.makeCanBeInsertedSelector(nodeTypesRegistry);

    return state => {
        const focusedNodeContextPath = selectors.UI.PageTree.getFocused(state);
        const clipboardNodeContextPath = selectors.CR.Nodes.clipboardNodeContextPathSelector(state);
        const canBePasted = canBePastedSelector(state, {
            subject: clipboardNodeContextPath,
            reference: focusedNodeContextPath
        });

        return {focusedNodeContextPath, canBePasted};
    };
}, {
    pasteNode: actions.CR.Nodes.paste
})
export default class PasteClipBoardNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        focusedNodeContextPath: PropTypes.string.isRequired,
        canBePasted: PropTypes.bool.isRequired,
        pasteNode: PropTypes.func.isRequired
    };

    handlePasteButtonClick = () => {
        const {pasteNode, focusedNodeContextPath} = this.props;

        pasteNode(focusedNodeContextPath);
    }

    render() {
        const {
            className,
            canBePasted
        } = this.props;

        return (
            <IconButton
                isDisabled={!canBePasted}
                className={className}
                icon="paste"
                onClick={this.handlePasteButtonClick}
                hoverStyle="clean"
                />
        );
    }
}
