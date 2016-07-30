import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
// import style from './style.css';

const Label = props => {
    const {
        children,
        className,
        htmlFor,
        style,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [style.label]: true,
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
    style: PropTypes.object
};
Label.defaultProps = {
    style: {}
};

export default Label;
