import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

import Node from './Node/index';
import style from './style.css';

export class Tree extends Component {
    static propTypes = {
        focused: PropTypes.string,
        active: PropTypes.string,
        className: PropTypes.string,

        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,

        children: PropTypes.node.isRequired
    };

    render() {
        const {className, ...directProps} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.treeWrapper]: true
        });

        return (
            <Node className={classNames} tabIndex="0" {...directProps}>
                {this.props.children}
            </Node>
        );
    }
}

Tree.Node = Node;

export default Tree;
