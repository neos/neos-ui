import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$get} from 'plow-js';
import IconButton from '@neos-project/react-ui-components/lib/IconButton/';

import {selectors, actions} from '@neos-project/neos-ui-redux-store';

@connect(state => ({
    focusedNodeContextPath: selectors.UI.PageTree.getFocused(state),
    siteNodeContextPath: $get('cr.nodes.siteNode', state),
    getNodeByContextPath: selectors.CR.Nodes.nodeByContextPath(state)
}), {
    cutNode: actions.CR.Nodes.cut
})
export default class CutSelectedNode extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        focusedNodeContextPath: PropTypes.string,
        siteNodeContextPath: PropTypes.string,

        getNodeByContextPath: PropTypes.func.isRequired,
        cutNode: PropTypes.func.isRequired
    };

    handleCutSelectedNodeClick = () => {
        const {focusedNodeContextPath, cutNode} = this.props;

        cutNode(focusedNodeContextPath);
    }

    render() {
        const {
            focusedNodeContextPath,
            siteNodeContextPath,
            getNodeByContextPath,
            className
        } = this.props;
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
                onClick={this.handleCutSelectedNodeClick}
                icon="cut"
                hoverStyle="clean"
                />
        );
    }
}
