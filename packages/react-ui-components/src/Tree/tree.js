import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import mergeClassNames from 'classnames';

export class Tree extends Component {
    static propTypes = {
        focused: PropTypes.string,
        active: PropTypes.string,
        className: PropTypes.string,

        onNodeToggle: PropTypes.func,
        onNodeClick: PropTypes.func,
        onNodeFocus: PropTypes.func,

        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({/* eslint-disable quote-props */
            'treeWrapper': PropTypes.string
        }).isRequired, /* eslint-enable quote-props */

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        NodeComponent: PropTypes.any.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

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
