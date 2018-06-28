import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {
        children,
        className,
        theme,
        error,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.tooltip]: true,
        [theme['tooltip--error']]: error,
        [className]: className && className.length
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
     * Whether this tooltip should indicate an error or not
     */
    error: PropTypes.bool
};

export default Tooltip;
