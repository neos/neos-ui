import React, {PureComponent, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

import Node from './Node/index';
import {dom} from '../../ContentCanvas/Helpers/index';

@connect($transform({
    allNodes: $get('cr.nodes.byContextPath'),
    pageTreeState: $get('ui.pageTree'),
    currentDocumentNodeContextPath: selectors.UI.ContentCanvas.getCurrentContentCanvasContextPath,
    getTreeNode: selectors.UI.PageTree.getTreeNodeSelector
}), {
    onNodeToggle: actions.UI.PageTree.toggle,
    onNodeFocus: actions.UI.PageTree.focus,
    setFocusedNode: actions.CR.Nodes.focus
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class PageTree extends PureComponent {
    static propTypes = {
        allNodes: PropTypes.object.isRequired,
        pageTreeState: PropTypes.object.isRequired,
        nodeTypesRegistry: PropTypes.object.isRequired,
        currentDocumentNodeContextPath: PropTypes.string,

        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeFocus: PropTypes.func,
        setFocusedNode: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleNodeClick = this.handleNodeClick.bind(this);
    }

    render() {
        const {currentDocumentNodeContextPath, nodeTypesRegistry, getTreeNode, onNodeToggle, onNodeFocus} = this.props;

        if (!currentDocumentNodeContextPath) {
            return (<div>...</div>);
        }

        const nonDocumentNodeTypes = nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('content')).concat(nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('contentCollection')));

        console.log("AA", nonDocumentNodeTypes);

        const siteNode = getTreeNode(currentDocumentNodeContextPath, nonDocumentNodeTypes);
        const siteNodeIcon = $get('ui.icon', nodeTypesRegistry.get(siteNode.nodeType));

        if (siteNode) {
            return (
                <Tree>
                    <Node
                        item={{
                            ...siteNode,
                            icon: siteNodeIcon
                        }}
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
        const fusionPath = dom.findOneFusionPathForContextPath(contextPath);
        this.props.setFocusedNode(contextPath, fusionPath);
        dom.moveIntoView(dom.findNode(contextPath, fusionPath));

        /*const selectedDomNode = clickPath.find(domNode => domNode && domNode.getAttribute && domNode.getAttribute('data-__neos-node-contextpath'));

            if (isInsideInlineUi) {
                // Do nothing, everything OK!
            } else if (selectedDomNode) {
                const contextPath = selectedDomNode.getAttribute('data-__neos-node-contextpath');
                const fusionPath = selectedDomNode.getAttribute('data-__neos-typoscript-path');
                */
        //setActiveContentCanvasSrc(src);
        //setActiveContentCanvasContextPath(contextPath);
    }
}
