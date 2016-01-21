import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import {Tree} from 'Host/Components/';
import {immutableOperations} from 'Shared/Util';
import backend from 'Host/Service/Backend.js';
import {connect} from 'react-redux';

const {$immutable, $get, $set} = immutableOperations;


let buildTreeData;
buildTreeData = (nodes, nodePaths) => {
    return $immutable(nodePaths
        .map((nodePath) => $get(nodes, [nodePath]))
        .filter((node) => !!node)
        .map((node) => {
            console.log(node);
            return {
                label: $get(node, 'label'),
                nodeType: $get(node, 'nodeType'),
                children: buildTreeData(nodes, $get(node, 'children'))
            };
        }));
};


@connect(state => {
    return {
        collapsedNodes: $get(state, 'ui.contentTree.collapsedNodes'),
        nodes: $get(state, 'nodes.byContextPath'),
        thisDocumentNodePath: $get(state, 'ui.tabs.active.contextPath')
    };
})
export default class ContentTree extends Component {

    static propTypes = {
        collapsedNodes: PropTypes.instanceOf(Immutable.List),
        nodes: PropTypes.instanceOf(Immutable.Map),
        thisDocumentNodePath: PropTypes.string
    }

    render() {
        const treeData = buildTreeData(this.props.nodes, (this.props.thisDocumentNodePath ? [this.props.thisDocumentNodePath] : []));

        return (
            <Tree
                data={treeData}
                onNodeToggle={this.onPageNodeToggle.bind(this)}
                onNodeClick={this.onPageNodeClick.bind(this)}
                onNodeFocusChanged={this.onPageNodeFocusChanged.bind(this)}
                />
        );
    }

    onPageNodeToggle(node) {
        const {nodeTreeService} = backend;
        const newNode = $set(node, 'isCollapsed', !$get(node, 'isCollapsed'));

        //nodeTreeService.updateNode(newNode);
        //nodeTreeService.loadSubTree($get(node, 'contextPath'), 'TYPO3.Neos:Document');
    }

    onPageNodeClick(node) {
        //const {nodeTreeService} = backend;
        //const newNode = $set(node, 'isFocused', !$get(node, 'isFocused'));

        //nodeTreeService.updateNode(newNode);
    }

    onPageNodeFocusChanged(node) {
        /*const {tabManager, nodeTreeService} = backend;
        const href = $get(node, 'href');
        const focused = $set(node, 'isFocused', !$get(node, 'isFocused'));
        const active = $set(focused, 'isActive', !$get(focused, 'isActive'));

        nodeTreeService.updateNode(active);
        tabManager.changeActiveTabSrc(href);*/
    }
}
