import React, {Component, PropTypes} from 'react';
import {$transform, $toggle, $all, $get} from 'plow-js';

import {Tree} from 'Host/Components/';
import backend from 'Host/Service/Backend.js';
import {connect} from 'react-redux';

@connect($transform({
    treeData: $get('ui.pageTree')
}))
export default class PageTree extends Component {
    static propTypes = {
        treeData: PropTypes.object
    };

    render() {
        const {treeData} = this.props;

        return (
            <Tree
                data={treeData}
                onNodeToggle={this.onPageNodeToggle.bind(this)}
                onNodeClick={this.onPageNodeClick.bind(this)}
                onNodeFocusChanged={this.onPageNodeFocusChanged.bind(this)}
                id="neos__leftSidebar__pageTree"
                />
        );
    }

    onPageNodeToggle(node) {
        const {nodeTreeService} = backend;
        const {contextPath} = node;

        nodeTreeService.updateNode(
            $toggle('isCollapsed', node)
        );
        nodeTreeService.loadSubTree(contextPath, 'TYPO3.Neos:Document');
    }

    onPageNodeClick(node) {
        const {nodeTreeService} = backend;

        nodeTreeService.updateNode(
            $toggle('isFocused', node)
        );
    }

    onPageNodeFocusChanged(node) {
        const {tabManager, nodeTreeService} = backend;
        const {href} = node;

        nodeTreeService.updateNode($all(
            $toggle('isFocused'),
            $toggle('isActive'),
            node
        ));
        tabManager.changeActiveTabSrc(href);
    }
}
