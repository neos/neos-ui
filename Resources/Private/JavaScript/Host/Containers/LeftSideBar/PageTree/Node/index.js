import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {$transform, $get} from 'plow-js';

import {UI} from 'Host/Selectors/index';
import {actions} from 'Host/Redux/index';

@connect(state => ({
    getTreeNode: UI.PageTree.getTreeNodeSelector(state),
    isFocused: UI.PageTree.getFocusedNodeContextPathSelector(state)
}), {
    onNodeFocus: actions.UI.PageTree.focus
})
export default class Node extends Component {
    static propTypes = {
        item: PropTypes.shape({
            hasChildren: PropTypes.bool.isRequired,
            isCollapsed: PropTypes.bool.isRequired,
            isActive: PropTypes.bool.isRequired,
            isFocused: PropTypes.bool.isRequired,
            isLoading: PropTypes.bool.isRequired,
            hasError: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            uri: PropTypes.string.isRequired,
            children: PropTypes.arrayOf(
                PropTypes.string
            ),
            isDblClick: PropTypes.bool.isRequired

            // @todo treeBind
            // @todo inputActive
        }),
        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,

    };

    constructor(props) {
        super(props);

        this.handleNodeToggle = this.handleNodeToggle.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleNodeLabelClick = this.handleNodeLabelClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {

        return (
            (nextProps.hasChildren && !this.props.item.isCollapsed) ||
            shallowCompare(this, nextProps, nextState));
    }

    render() {
        const {item, getTreeNode, onNodeToggle, onNodeClick, onNodeFocus, onDoubleClick} = this.props;

        return getTreeNode ? (
            <Tree.Node>
                <Tree.Node.Header
                    item={item}
                    onToggle={this.handleNodeToggle}
                    onClick={this.handleNodeClick}
                    onLabelClick={this.handleNodeLabelClick}
                    onDoubleClick={this.onDoubleClick}
                    />
                {item.isCollapsed ? null : (
                    <Tree.Node.Contents>
                        {item.children
                            .map(contextPath => getTreeNode(contextPath, 'TYPO3.Neos:Document'))
                            .filter(i => i)
                            .map(item =>
                                <Node
                                    key={item.contextPath}
                                    item={item}
                                    getTreeNode={getTreeNode}
                                    onNodeToggle={onNodeToggle}
                                    onNodeClick={onNodeClick}
                                    onNodeFocus={onNodeFocus}
                                    />
                        )}
                    </Tree.Node.Contents>
                )}
            </Tree.Node>
        ) : null;
    }

    handleNodeToggle() {
        const {item, onNodeToggle} = this.props;

        onNodeToggle(item.contextPath);
    }

    onDoubleClick(event) {
        console.log('onDoubleClick');
    }

    handleNodeClick(event) {

        const {item, onNodeFocus} = this.props;
        onNodeFocus(item.uri);
    }

    handleNodeLabelClick(event) {
        this.props.onNodeFocus(this.props.item.contextPath);

        if (this.props.item.isFocused) {
            console.info('isFocused');
        } else {
            console.info('isFocused NOT');
        }

        const {item, onNodeClick} = this.props;

        onNodeClick(item.contextPath);
    }
}
