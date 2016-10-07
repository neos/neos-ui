import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Tree from '@neos-project/react-ui-components/lib/Tree/';

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
    onNodeFocus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.UI.ContentCanvas.setContextPath
})
export default class PageTree extends Component {
    static propTypes = {
        allNodes: PropTypes.object.isRequired,
        pageTreeState: PropTypes.object.isRequired,
        siteNodeContextPath: PropTypes.string,

        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeFocus: PropTypes.func,
        setActiveContentCanvasSrc: PropTypes.func,
        setActiveContentCanvasContextPath: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    shouldComponentUpdate({allNodes, pageTreeState}) {
        return (
            allNodes !== this.props.allNodes ||
            pageTreeState !== this.props.pageTreeState
        );
    }

    render() {
        const {siteNodeContextPath, getTreeNode, onNodeToggle, onNodeFocus} = this.props;
        const siteNode = getTreeNode(siteNodeContextPath);

        if (siteNode) {
            return (
                <Tree>
                    <Node
                        item={siteNode}
                        onNodeToggle={onNodeToggle}
                        onNodeClick={this.handleNodeClick}
                        onNodeFocus={onNodeFocus}
                        />
                </Tree>
            );
        }

        return null;
    }

    handleNodeClick(src, contextPath) {
        const {setActiveContentCanvasSrc, setActiveContentCanvasContextPath} = this.props;

        setActiveContentCanvasSrc(src);
        setActiveContentCanvasContextPath(contextPath);
    }
}
