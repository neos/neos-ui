import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect($transform({
    node: selectors.CR.Nodes.focusedSelector
}), {
    hideNode: actions.CR.Nodes.hide,
    showNode: actions.CR.Nodes.show
})
export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        node: PropTypes.object,
        className: PropTypes.string,
        hideNode: PropTypes.func.isRequired,
        showNode: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleHideNode = this.handleHideNode.bind(this);
        this.handleShowNode = this.handleShowNode.bind(this);
    }

    render() {
        const {className, node} = this.props;
        const isDisabled = !node || $get('isAutoCreated', node);
        const isHidden = $get('properties._hidden', node);

        return (
            <IconButton
                className={className}
                isActive={isHidden}
                isDisabled={isDisabled}
                onClick={isHidden ? this.handleShowNode : this.handleHideNode}
                icon="eye-slash"
                hoverStyle="clean"
                />
        );
    }

    handleHideNode() {
        const {node, hideNode} = this.props;

        hideNode($get('contextPath', node));
    }

    handleShowNode() {
        const {node, showNode} = this.props;

        showNode($get('contextPath', node));
    }
}
