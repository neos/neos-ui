import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {children, type, className, theme} = props;

    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.tooltip]: true,
        [theme['tooltip--error']]: type === 'error',
        [theme['tooltip--warning']]: type === 'warning',
        [theme['tooltip--success']]: type === 'success',
        [theme['tooltip--info']]: type === 'info',
        [theme['tooltip--light']]: type === 'light'
    });

    if (children) {
        return (
            <ReactTooltip className={classNames} {...props}>
                {children}
            </ReactTooltip>
        );
    }

    return <ReactTooltip {...props}/>;
};

Tooltip.propTypes = {
    /**
     * A unique ID to refenrence the node the tooltip belongs to. This ID
     * must be set in a data-for attribute on the related node
     */
    id: PropTypes.string.isRequired,

    /**
     * The children to render within the tooltip node. If children are set
     * the prop label is not rendered
     */
    children: PropTypes.node,

    /**
     * The positon where the Tooltip should be placed. Should be one of
     * top, right, bottom or left
     */
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,

    /**
     * The type of the tooltip
     * TODO
     */
    type: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'light', 'dark']).isRequired,

    /**
     * Should the tooltop be sticky or float with the mouse cursor. Defaults
     * to sticky,
     */
    effect: PropTypes.oneOf(['float', 'solid']),

    /**
     * Delay until the tooltip is displayed
     */
    delayShow: PropTypes.number,

    /**
     * Additonal class names can be injected in this prop
     */
    className: PropTypes.string,

    theme: PropTypes.object.isRequired
};

Tooltip.defaultProps = {
    type: 'info',
    place: 'top',
    effect: 'solid',
    delayShow: 500
};

export default Tooltip;
