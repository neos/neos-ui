import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';

export class Tree extends Component {
    static propTypes = {
        focused: PropTypes.string,
        active: PropTypes.string,
        className: PropTypes.string,

        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,

        children: PropTypes.node.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'treeWrapper': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        NodeComponent: PropTypes.element.isRequired
    };

    render() {
        const {NodeComponent, className, theme, ...rest} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.treeWrapper]: true
        });

        return (
            <NodeComponent {...rest} className={classNames} tabIndex="0">
                {this.props.children}
            </NodeComponent>
        );
    }
}

export default Tree;
