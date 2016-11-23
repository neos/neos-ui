import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {$get} from 'plow-js';
import {connect} from 'react-redux';

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
            isDblClick: PropTypes.bool

            // @todo treeBind
            // @todo inputActive
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
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            (nextProps.hasChildren && !this.props.item.isCollapsed) ||
            shallowCompare(this, nextProps, nextState));
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
                    onDoubleClick={this.handleDoubleClick}
                    />
                {item.isCollapsed ? null : (
                    <Tree.Node.Contents>
                        {item.children
                            .map(contextPath => {
                                const node = getTreeNode(
                                    contextPath,
                                    nodeTypesRegistry.getSubTypesOf('TYPO3.Neos:Document')
                                );

                                if (!node) {
                                    return null;
                                }

                                const nodeIcon = $get('ui.icon', nodeTypesRegistry.get(node.nodeType));

                                return {
                                    ...node,
                                    icon: nodeIcon
                                };
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

    handleDoubleClick() {
        console.log('onDoubleClick');
    }

    handleNodeClick() {
        const {item, onNodeFocus} = this.props;
        onNodeFocus(item.uri);
    }

    handleNodeLabelClick() {
        const {item, onNodeFocus, onNodeClick} = this.props;

        onNodeFocus(item.contextPath);
        onNodeClick(item.uri, item.contextPath);

        if (this.props.item.isFocused) {
            console.info('isFocused');
        } else {
            console.info('isFocused NOT');
        }

        if (this.props.item.isActive) {
            console.info('isActive');
        } else {
            console.info('isActive NOT');
        }
    }
}
