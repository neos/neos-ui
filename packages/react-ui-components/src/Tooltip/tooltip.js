import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {
        children,
        className,
        theme,
        renderInline,
        asError,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.tooltip]: true,
        [theme['tooltip--asError']]: asError,
        [theme['tooltip--inline']]: renderInline,
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
     * If set to true the tooltip won't be positioned absolute but relative and
     * show up inline
     */
    renderInline: PropTypes.bool,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.object,

    /**
     * Whether this tooltip should indicate an error or not
     */
    asError: PropTypes.bool
};

Tooltip.defaultProps = {
    renderInline: false
};

export default Tooltip;
