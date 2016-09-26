import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {UI} from 'Host/Selectors/index';

@connect(state => ({
    getTreeNode: UI.PageTree.getTreeNodeSelector(state)
}))
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
            )
        }),
        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleNodeToggle = this.handleNodeToggle.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleNodeLabelClick = this.handleNodeLabelClick.bind(this);
    }

    shouldComponentUpdate({item}) {
        return (
            item.isCollapsed !== this.props.item.isCollapsed ||
            (item.hasChildren && !this.props.item.isCollapsed) ||
            item.isActive !== this.props.item.isActive ||
            item.isFocused !== this.props.item.isFocused ||
            item.isLoading !== this.props.item.isLoading ||
            item.hasError !== this.props.item.hasError
        );
    }

    render() {
        const {item, getTreeNode, onNodeToggle, onNodeClick, onNodeFocus} = this.props;

        return getTreeNode ? (
            <Tree.Node>
                <Tree.Node.Header
                    item={item}
                    onToggle={this.handleNodeToggle}
                    onClick={this.handleNodeClick}
                    onLabelClick={this.handleNodeLabelClick}
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

    handleNodeClick() {
        const {item, onNodeFocus} = this.props;

        onNodeFocus(item.contextPath);
    }

    handleNodeLabelClick() {
        const {item, onNodeClick} = this.props;

        onNodeClick(item.uri);
    }
}
