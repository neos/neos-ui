import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform} from 'plow-js';

import {Tree} from 'Components/index';
import {UI} from 'Host/Selectors/index';
import {actions} from 'Host/Redux/index';

@connect($transform({
    rootNode: UI.PageTree.treeSelector
}), {
    onNodeToggle: actions.UI.PageTree.toggle,
    onNodeClick: actions.UI.ContentView.setSrc,
    onNodeFocus: actions.UI.PageTree.focus
})
export default class PageTree extends Component {
    static propTypes = {
        rootNode: PropTypes.object,

        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func
    };

    render() {
        const {rootNode, onNodeToggle, onNodeClick, onNodeFocus} = this.props;

        return (
            rootNode ? <Tree
                rootNode={rootNode}
                onNodeToggle={node => onNodeToggle(node.contextPath)}
                onNodeClick={node => onNodeClick(node.uri)}
                onNodeFocus={node => onNodeFocus(node.contextPath)}
                id="neos__leftSidebar__pageTree"
                /> : null
        );
    }
}
