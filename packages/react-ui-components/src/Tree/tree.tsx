import React, {PureComponent} from 'react';
import withScrolling, {createVerticalStrength, createHorizontalStrength} from './reactDndScrollzoneFork';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const ScrollingComponent = withScrolling('div');
const verticalStrength = createVerticalStrength(50);

class Tree extends PureComponent {
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
    }

    render() {
        const {NodeComponent, className, theme, ...rest} = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.treeWrapper]: true
        });

        return (
            <ScrollingComponent
                strengthMultiplier={20}
                verticalStrength={verticalStrength}
                horizontalStrength={createHorizontalStrength(50)}
                className={classNames}
                tabIndex="0"
                role="tree"
                >
                <NodeComponent {...rest}>
                    {this.props.children}
                </NodeComponent>
            </ScrollingComponent>
        );
    }
}

export default Tree;
