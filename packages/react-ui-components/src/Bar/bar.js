import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class Bar extends PureComponent {
    static propTypes = {
        /**
         * This prop controls the vertical positioning of the Bar.
         */
        position: PropTypes.oneOf(['top', 'bottom']).isRequired,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'bar': PropTypes.string,
            'bar--top': PropTypes.string,
            'bar--bottom': PropTypes.string
        }).isRequired,

        /**
         * An optional `className` to attach to the wrapper.
         */
        className: PropTypes.string,

        /**
         * The contents to be rendered within the `Bar`.
         */
        children: PropTypes.any.isRequired
    };

    render() {
        const {position, className, theme, children, ...rest} = this.props;
        const finalClassName = mergeClassNames({
            [className]: className && className.length,
            [theme.bar]: true,
            [theme['bar--top']]: position === 'top',
            [theme['bar--bottom']]: position === 'bottom'
        });

        return (
            <div className={finalClassName} {...rest}>
                {children}
            </div>
        );
    }
}

export default Bar;
