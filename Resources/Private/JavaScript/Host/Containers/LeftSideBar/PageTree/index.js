import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {Tree} from 'Components/index';
import {UI} from 'Host/Selectors/index';
import {actions} from 'Host/Redux/index';

import Node from './Node/index';

@connect($transform({
    allNodes: $get('cr.nodes.byContextPath'),
    pageTreeState: $get('ui.pageTree'),
    siteNodeContextPath: $get('cr.nodes.siteNode'),
    getTreeNode: UI.PageTree.getTreeNodeSelector
}), {
    onNodeToggle: actions.UI.PageTree.toggle,
    onNodeClick: actions.UI.ContentCanvas.setSrc,
    onNodeFocus: actions.UI.PageTree.focus
})
export default class PageTree extends Component {
    static propTypes = {
        allNodes: PropTypes.object.isRequired,
        pageTreeState: PropTypes.object.isRequired,
        siteNodeContextPath: PropTypes.string,

        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func
    };

    shouldComponentUpdate({allNodes, pageTreeState}) {
        return (
            allNodes !== this.props.allNodes ||
            pageTreeState !== this.props.pageTreeState
        );
    }

    render() {
        const {siteNodeContextPath, getTreeNode, onNodeToggle, onNodeClick, onNodeFocus} = this.props;
        const siteNode = getTreeNode(siteNodeContextPath);

        if (siteNode) {
            return (
                <Tree>
                    <Node
                        item={siteNode}
                        onNodeToggle={onNodeToggle}
                        onNodeClick={onNodeClick}
                        onNodeFocus={onNodeFocus}
                        />
                </Tree>
            );
        }

        return null;
    }
}
