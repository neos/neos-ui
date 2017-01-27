import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Badge = props => {
    const {
        className,
        theme,
        label,
        ...rest
    } = props;
    const finalClassName = mergeClassNames({
        [theme.badge]: true,
        [className]: className && className.length
    });
    const attributes = {};

    return (
        <div {...rest} {...attributes} className={finalClassName}>{label}</div>
    );
};
Badge.propTypes = {
    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * Badge's label.
     */
    label: PropTypes.string,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        badge: PropTypes.string
    }).isRequired
};

export default Badge;
