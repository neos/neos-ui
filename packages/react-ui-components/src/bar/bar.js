import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Bar = props => {
    const {position, className, theme, children, ...rest} = props;
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
};
Bar.propTypes = {
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

export default Bar;
