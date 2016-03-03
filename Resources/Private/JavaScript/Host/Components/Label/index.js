import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

const Label = props => {
    const {
        children,
        className,
        ...directProps
    } = props;
    const classNames = mergeClassNames({
        [style.label]: true,
        [className]: className && className.length
    });

    return (
        <label className={classNames} {...directProps}>
            {children}
        </label>
    );
};
Label.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

export default Label;
