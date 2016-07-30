import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Label = props => {
    const {
        children,
        className,
        htmlFor,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.label]: true,
        [className]: className && className.length
    });

    return (
        <label {...rest} htmlFor={htmlFor} className={classNames}>
            {children}
        </label>
    );
};
Label.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
    theme: PropTypes.object
};
Label.defaultProps = {
    theme: {}
};

export default Label;
