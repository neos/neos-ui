import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import {Tree} from 'Host/Components/';
import {immutableOperations} from 'Shared/Util';
import backend from 'Host/Service/Backend.js';
import {connect} from 'react-redux';

const {$get, $set} = immutableOperations;

@connect(state => {
    return {
        treeData: $get(state, 'ui.pageTree')
    };
})
export default class PageTree extends Component {
    static propTypes = {
        treeData: PropTypes.instanceOf(Immutable.Map)
    };

    render() {
        const {treeData} = this.props;

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

        nodeTreeService.updateNode(newNode);
        nodeTreeService.loadSubTree($get(node, 'contextPath'), 'TYPO3.Neos:Document');
    }

    onPageNodeClick(node) {
        const {nodeTreeService} = backend;
        const newNode = $set(node, 'isFocused', !$get(node, 'isFocused'));

        nodeTreeService.updateNode(newNode);
    }

    onPageNodeFocusChanged(node) {
        const {tabManager, nodeTreeService} = backend;
        const href = $get(node, 'href');
        const focused = $set(node, 'isFocused', !$get(node, 'isFocused'));
        const active = $set(focused, 'isActive', !$get(focused, 'isActive'));

        nodeTreeService.updateNode(active);
        tabManager.changeActiveTabSrc(href);
    }
}
