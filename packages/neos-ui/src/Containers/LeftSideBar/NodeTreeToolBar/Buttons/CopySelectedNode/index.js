import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.UI.PageTree.getFocused(state)
}), {
    copyNode: actions.CR.Nodes.copy
})
export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,

        copyNode: PropTypes.func.isRequired
    };

    handleCopySelectedNodeClick = () => {
        const {focusedNodeContextPath, copyNode} = this.props;

        copyNode(focusedNodeContextPath);
    }

    render() {
        const {
            focusedNodeContextPath,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={!focusedNodeContextPath}
                onClick={this.handleCopySelectedNodeClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }
}
