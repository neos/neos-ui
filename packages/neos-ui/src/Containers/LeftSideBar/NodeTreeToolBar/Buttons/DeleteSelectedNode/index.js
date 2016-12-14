import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import {selectors} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.UI.PageTree.getFocusedNodeContextPathSelector(state),
    siteNodeContextPath: $get('cr.nodes.siteNode', state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}))
export default class DeleteSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,

        focusedNodeContextPath: PropTypes.string.isRequired,
        getNodeByContextPath: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.handleDeleteSelectedNodeClick = this.deleteSelectedNode.bind(this);
    }

    render() {
        const {className, focusedNodeContextPath, siteNodeContextPath, getNodeByContextPath} = this.props;
        const node = getNodeByContextPath(focusedNodeContextPath);

        //
        // Do not allow deletion, when there's no focused node, the focused node is auto created or the focused node
        // is the site node
        //
        const isDisabled = !node || $get('isAutoCreated', node) || siteNodeContextPath === focusedNodeContextPath;

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
        console.log('delete selected node');
    }
}
