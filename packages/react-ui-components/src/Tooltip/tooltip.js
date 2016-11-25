import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Tooltip = props => {
    const {
        children,
        className,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.tooltip]: true,
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
    theme: PropTypes.object
};

export default Tooltip;
