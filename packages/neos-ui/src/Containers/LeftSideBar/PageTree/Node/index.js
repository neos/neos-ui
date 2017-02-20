import React, {PureComponent, PropTypes} from 'react';
import {$get, $set} from 'plow-js';
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Tree from '@neos-project/react-ui-components/lib/Tree/';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {neos} from '@neos-project/neos-ui-decorators';

@connect(state => ({
    getTreeNode: selectors.UI.PageTree.getTreeNodeSelector(state),
    isFocused: selectors.UI.PageTree.getFocusedNodeContextPathSelector(state)
}), {
    onNodeFocus: actions.UI.PageTree.focus
})
@neos(globalRegistry => ({
    nodeTypesRegistry: globalRegistry.get('@neos-project/neos-ui-contentrepository')
}))
export default class Node extends PureComponent {
    static propTypes = {
        item: PropTypes.shape({
            hasChildren: PropTypes.bool.isRequired,
            isCollapsed: PropTypes.bool.isRequired,
            isActive: PropTypes.bool.isRequired,
            isFocused: PropTypes.bool.isRequired,
            isLoading: PropTypes.bool.isRequired,
            isHidden: PropTypes.bool.isRequired,
            hasError: PropTypes.bool.isRequired,
            label: PropTypes.string.isRequired,
            icon: PropTypes.string,
            uri: PropTypes.string.isRequired,
            children: PropTypes.oneOfType([PropTypes.array, ImmutablePropTypes.listOf(PropTypes.string)])

        }),
        getTreeNode: PropTypes.func,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,
        nodeTypesRegistry: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.handleNodeToggle = this.handleNodeToggle.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleNodeLabelClick = this.handleNodeLabelClick.bind(this);
    }

    render() {
        const {item, nodeTypesRegistry, getTreeNode, onNodeToggle, onNodeClick, onNodeFocus} = this.props;
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
                            .map(contextPath => {
                                const node = getTreeNode(
                                    contextPath,
                                    nodeTypesRegistry.getSubTypesOf(nodeTypesRegistry.getRole('document'))
                                );

                                if (!node) {
                                    return null;
                                }

                                const nodeIcon = $get('ui.icon', nodeTypesRegistry.get(node.nodeType));
                                return $set('icon', nodeIcon, node);
                            })
                            .filter(i => i)
                            .map(item =>
                                <Node
                                    key={item.contextPath}
                                    item={item}
                                    getTreeNode={getTreeNode}
                                    onNodeToggle={onNodeToggle}
                                    onNodeClick={onNodeClick}
                                    onNodeFocus={onNodeFocus}
                                    nodeTypesRegistry={nodeTypesRegistry}
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
        const {item, onNodeFocus, onNodeClick} = this.props;
        onNodeFocus(item.contextPath);
        onNodeClick(item.uri, item.contextPath);
    }
}
