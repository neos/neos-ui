import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {
        children,
        id,
        place,
        style,
        type,
        className,
        theme,
        effect
    } = props;

    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.tooltip]: true,
        [theme['tooltip--error']]: type === 'error'
    });

    return (
        <ReactTooltip className={classNames} {...props}>
            {children}
        </ReactTooltip>
    );
};

Tooltip.propTypes = {

    /**
     * TODO
     */
    id: PropTypes.string.isRequired,

    /**
     * The children to render within the tooltip node.
     */
    children: PropTypes.node,

    /**
     * The positon where the ToolTip should be placed. Should be one of
     * top, right, bottom or left
     */
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,

    /**
     *  TODO
     */
    style: PropTypes.string,

    /**
     * The type of the tooltip
     * TODO
     */
    type: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'light']).isRequired,

    /**
     * Should the tooltop be sticky or float with the mouse cursor. Defaults
     * to sticky,
     */
    effect: PropTypes.oneOf(['float', 'solid']),

    /**
     *
     */
    className: PropTypes.string,

    theme: PropTypes.object.isRequired

};

Tooltip.defaultProps = {
    type: 'warning',
    place: 'top',
    effect: 'solid'
};

export default Tooltip;
