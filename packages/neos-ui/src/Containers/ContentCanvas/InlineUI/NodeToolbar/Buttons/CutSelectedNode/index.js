import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.CR.Nodes.focusedNodePathSelector(state)
}), {
    cutNode: actions.CR.Nodes.cut
})
export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,

        cutNode: PropTypes.func.isRequired
    };

    handleCutSelectedNodeClick = () => {
        const {focusedNodeContextPath, cutNode} = this.props;

        cutNode(focusedNodeContextPath);
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
                onClick={this.handleCutSelectedNodeClick}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }
}
