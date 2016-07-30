import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

const Label = props => {
    const {
        children,
        className,
        htmlFor,
        ...directProps
    } = props;
    const classNames = mergeClassNames({
        [style.label]: true,
        [className]: className && className.length
    });

    return (
        <label htmlFor={htmlFor} className={classNames} {...directProps}>
            {children}
        </label>
    );
};
Label.propTypes = {
    htmlFor: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node
};

export default Label;
