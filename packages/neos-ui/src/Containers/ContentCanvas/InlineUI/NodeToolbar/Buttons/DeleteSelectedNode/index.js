import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    node: selectors.CR.Nodes.focusedSelector
}), {
    removeNode: actions.CR.Nodes.commenceRemoval
})
export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        node: PropTypes.object,
        className: PropTypes.string,
        removeNode: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleDeleteSelectedNodeClick = this.deleteSelectedNode.bind(this);
    }

    render() {
        const {className, node} = this.props;
        const isDisabled = !node || $get('isAutoCreated', node);

        return (
            <IconButton
                className={className}
                isDisabled={isDisabled}
                onClick={this.handleDeleteSelectedNodeClick}
                icon="trash"
                hoverStyle="clean"
                />
        );
    }

    deleteSelectedNode() {
        const {node, removeNode} = this.props;

        removeNode($get('contextPath', node));
    }
}
