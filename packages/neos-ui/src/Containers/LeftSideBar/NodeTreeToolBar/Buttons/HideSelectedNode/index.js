import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.UI.PageTree.getFocusedNodeContextPathSelector(state),
    siteNodeContextPath: $get('cr.nodes.siteNode', state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}), {
    hideNode: actions.CR.Nodes.hide,
    showNode: actions.CR.Nodes.show
})
export default class HideSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        siteNodeContextPath: PropTypes.string.isRequired,
        getNodeByContextPath: PropTypes.func.isRequired,
        hideNode: PropTypes.func.isRequired,
        showNode: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleHideNode = this.handleHideNode.bind(this);
        this.handleShowNode = this.handleShowNode.bind(this);
    }

    render() {
        const {className, focusedNodeContextPath, siteNodeContextPath, getNodeByContextPath} = this.props;
        const node = getNodeByContextPath(focusedNodeContextPath);
        //
        // Do not allow deletion, when there's no focused node, the focused node is auto created or the focused node
        // is the site node
        //
        const isDisabled = !node || $get('isAutoCreated', node) || siteNodeContextPath === focusedNodeContextPath;
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
        const {focusedNodeContextPath, hideNode} = this.props;

        hideNode(focusedNodeContextPath);
    }

    handleShowNode() {
        const {focusedNodeContextPath, showNode} = this.props;

        showNode(focusedNodeContextPath);
    }
}
