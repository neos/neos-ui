import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get, $set} from 'plow-js';

import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Node from './Node/index';

@connect($transform({
    allNodes: $get('cr.nodes.byContextPath'),
    pageTreeState: $get('ui.pageTree'),
    siteNodeContextPath: $get('cr.nodes.siteNode'),
    getTreeNode: selectors.UI.PageTree.getTreeNodeSelector
}), {
    onNodeToggle: actions.UI.PageTree.toggle,
    onNodeFocus: actions.UI.PageTree.focus,
    setActiveContentCanvasSrc: actions.UI.ContentCanvas.setSrc,
    setActiveContentCanvasContextPath: actions.UI.ContentCanvas.setContextPath
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class PageTree extends PureComponent {
    static propTypes = {
        allNodes: PropTypes.object.isRequired,
        pageTreeState: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
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

    render() {
        const {siteNodeContextPath, nodeTypesRegistry, getTreeNode, onNodeToggle, onNodeFocus} = this.props;

        if (!siteNodeContextPath) {
            return (<div>...</div>);
        }

        const siteNode = getTreeNode(siteNodeContextPath, nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document')));
        const siteNodeIcon = $get('ui.icon', nodeTypesRegistry.get(siteNode.nodeType));
        const node = $set('icon', siteNodeIcon, siteNode);

        if (siteNode) {
            return (
                <Tree>
                    <Node
                        item={node}
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
