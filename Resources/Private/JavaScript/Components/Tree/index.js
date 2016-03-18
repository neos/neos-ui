import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import NodeHeader from './NodeHeader/index';
import style from './style.css';

export default class Tree extends Component {
    static propTypes = {
        rootNode: PropTypes.object,
        focused: PropTypes.string,
        active: PropTypes.string,
        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,
        className: PropTypes.string
    };

    render() {
        const {className, rootNode, ...directProps} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.treeWrapper]: true
        });

        return (
            <div className={classNames} tabIndex="0" {...directProps}>
                {this.renderNode(rootNode)}
            </div>
        );
    }

    renderNode(node) {
        const {contextPath, isCollapsed, children} = node;
        const {onNodeToggle, onNodeClick, onNodeFocus} = this.props;
        return (
            <div key={contextPath}>
                <NodeHeader
                    node={node}
                    onToggle={() => onNodeToggle(node)}
                    onClick={() => onNodeFocus(node)}
                    onLabelClick={() => onNodeClick(node)}
                    />
                <div className={style.treeWrapper__treeChildren}>
                    {children && !isCollapsed ? children.map(child => this.renderNode(child)) : null}
                </div>
            </div>
        );
    }
}
