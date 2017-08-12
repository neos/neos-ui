
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

    calculateOffsetRight() {
        const tooltip = findDOMNode(this);
        const offsetRight = window.innerWidth - tooltip.getBoundingClientRect().right;

        if (offsetRight < 0) {
            this.setState({
                style: {transform: `translateX(${offsetRight}px)`}
            });
        }
    }

    calculateOffsetLeft() {
        const tooltip = findDOMNode(this);
        const offsetLeft = tooltip.getBoundingClientRect().left;
        const convertOffsetLet = Math.abs(offsetLeft);

        if (offsetLeft < 0) {
            this.setState({
                style: {transform: `translateX(${convertOffsetLet}px)`}
            });
        }
    }

    componentDidMount() {
        this.calculateOffsetRight();
        this.calculateOffsetLeft();
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
            [className]: className,
            [theme['tooltip--regular']]: style === 'regular'
        });

        return (
            <div {...rest} className={classNames}>
                <div className={theme['tooltip--arrow']}/>
                <div className={theme['tooltip--inner']} style={inlineStyle}>
                    {children}
                </div>
            </div>
        );
    }
}

export default Tooltip;
