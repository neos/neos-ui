import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import {immutableOperations, filterDeep} from 'Shared/Utilities/';
import NodeHeader from './NodeHeader/';
import style from './style.css';

const {$get} = immutableOperations;

export default class Tree extends Component {
    static propTypes = {
        data: PropTypes.instanceOf(Immutable.Map),
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocusChanged: PropTypes.func,
        className: PropTypes.string
    };

    render() {
        const {className, data, ...directProps} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.treeWrapper]: true
        });

        return (
            <div className={classNames} tabIndex="0" onKeyDown={this.onKeyDown.bind(this)} {...directProps}>
                {this.renderTree(data)}
            </div>
        );
    }

    renderTree(nodes) {
        return nodes.map((node, key) => {
            const children = $get(node, 'children');
            const isCollapsed = $get(node, 'isCollapsed');

            return (
                <div key={key}>
                    <NodeHeader
                        node={node}
                        onToggle={this.onTreeToggle.bind(this)}
                        onClick={this.onNodeClicked.bind(this)}
                        onLabelClick={e => this.onNodeLabelClick(e, node)}
                        />
                    <div className={style.treeWrapper__treeChildren}>
                        {children && !isCollapsed ? this.renderTree(children) : null}
                    </div>
                </div>
            );
        }).toArray();
    }

    onTreeToggle(node) {
        const {onNodeToggle} = this.props;

        if (onNodeToggle) {
            onNodeToggle(node);
        }
    }

    onNodeClicked(node) {
        const {onNodeClick} = this.props;

        if (onNodeClick) {
            onNodeClick(node);
        }
    }

    onNodeLabelClick(node) {
        this.changeNodeFocus(node);
    }

    changeNodeFocus(node) {
        const {onNodeFocusChanged} = this.props;

        if (onNodeFocusChanged) {
            onNodeFocusChanged(node);
        }
    }

    onKeyDown(e) {
        const focusedNode = this.getFocusedNode();

        switch (e.key) {
            case 'ArrowUp':
                // ToDo: Implement the onFocusChanged prop.
                this.changeNodeFocus('todo');
                break;
            case 'ArrowDown':
                // ToDo: Implement the onFocusChanged prop.
                this.changeNodeFocus('todo');
                break;
            case 'ArrowRight':
                this.onTreeToggle(focusedNode);
                break;
            case 'Enter':
                this.onNodeClick(focusedNode);
                break;
            default:
                break;
        }
    }

    getFocusedNode() {
        return filterDeep(this.props.data, item => item.isFocused === true);
    }
}
