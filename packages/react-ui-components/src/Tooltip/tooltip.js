import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {
        children,
        className,
        style,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.tooltip]: true,
        [className]: className && className.length,
        [theme['tooltip--regular']]: style === 'regular'
    });

    return (
        <div {...rest} className={classNames}>
            <div className={theme['tooltip--arrow']}/>
            <div className={theme['tooltip--inner']}>
                {children}
            </div>
        </div>
    );
};
Tooltip.propTypes = {
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

Tooltip.defaultProps = {
    style: 'error'
};

export default Tooltip;
