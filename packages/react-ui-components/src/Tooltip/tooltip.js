
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {findDOMNode} from 'react-dom';

export class Tooltip extends PureComponent {
    static propTypes = {
      /**
       * An optional className to render on the tooltip node.
       */
        className: PropTypes.string,

      /**
       * The children to render within the tooltip node.
       */
        children: PropTypes.node,

      /**
       * An optional css theme to be injected.
       */
        theme: PropTypes.object,

      /**
       * Use several style options
       */
        style: PropTypes.oneOf(['regular', 'error'])

    };

    static defaultProps = {
        style: 'error'
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            style: {}
        };
    }

    calculateOffset() {
        const tooltip = findDOMNode(this);
        const offset = window.innerWidth - tooltip.getBoundingClientRect().right;

        if (offset < 0) {
            this.setState({
                style: {transform: `translateX(${offset}px)`}
            });
        }
    }

    componentDidMount() {
        this.calculateOffset();
    }

    render() {
        const {
          children,
          className,
          style,
          theme,
          ...rest
        } = this.props;

        const {
          style: inlineStyle
        } = this.state;

        const classNames = mergeClassNames({
            [theme.tooltip]: true,
            [className]: className && className.length,
            [theme['tooltip--regular']]: style === 'regular'
        });

        return (
            <div {...rest} className={classNames} style={inlineStyle}>
                <div className={theme['tooltip--arrow']}/>
                <div className={theme['tooltip--inner']}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Tooltip;
