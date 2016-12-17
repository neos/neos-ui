import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
}), {
    copyNode: actions.CR.Nodes.copy
})
export default class CopySelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,

        copyNode: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleCopySelectedNodeClick = this.copySelectedNode.bind(this);
    }

    render() {
        const {
            focusedNodeContextPath,
            className
        } = this.props;

        return (
            <IconButton
                className={className}
                isDisabled={!Boolean(focusedNodeContextPath)}
                onClick={this.handleCopySelectedNodeClick}
                icon="copy"
                hoverStyle="clean"
                />
        );
    }

    copySelectedNode() {
        const {focusedNodeContextPath, copyNode} = this.props;

        copyNode(focusedNodeContextPath);
    }
}
