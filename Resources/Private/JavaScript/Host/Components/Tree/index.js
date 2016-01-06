import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import NodeHeader from './NodeHeader/';
import style from './style.css';

export default class Tree extends Component {
    static propTypes = {
        data: PropTypes.array.isRequired,
        onNodeToggle: PropTypes.func,
        onNodeLabelClick: PropTypes.func,
        onNodeClick: PropTypes.func,
        className: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {className, data} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [style.treeWrapper]: true
        });

        return (
            <div className={classNames}>
                {this.renderTree(data)}
            </div>
        );
    }

    renderTree(nodes) {
        return nodes.map((node, key) => {
            const {
                icon,
                name,
                children,
                isCollapsed,
                isActive
            } = node;
            const isCollapsable = children && children.length !== 0;

            return (
                <div className={style.treeWrapper__tree} key={key}>
                    <NodeHeader
                        title={name}
                        icon={icon}
                        isCollapsable={isCollapsable}
                        isCollapsed={isCollapsed}
                        isActive={isActive}
                        onToggle={e => this.onTreeToggle(e, node)}
                        onClick={e => this.onNodeClick(e, node)}
                        onLabelClick={e => this.onNodeLabelClick(e, node)}
                        />
                    <div className={style.treeWrapper__tree__children}>
                        {children && !isCollapsed ? this.renderTree(children) : null}
                    </div>
                </div>
            );
        });
    }

    onTreeToggle(e, node) {
        const {onNodeToggle} = this.props;

        if (onNodeToggle) {
            onNodeToggle(node);
        }
    }

    onNodeClick(e, node) {
        const {onNodeClick} = this.props;

        if (onNodeClick) {
            onNodeClick(node);
        }
    }

    onNodeLabelClick(e, node) {
        const {onNodeLabelClick} = this.props;

        e.stopPropagation();

        if (onNodeLabelClick) {
            onNodeLabelClick(node);
        }
    }
}
