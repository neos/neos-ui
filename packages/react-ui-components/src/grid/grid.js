import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Grid = props => {
    const {className, children, theme, ...rest} = props;
    const finalClassName = mergeClassNames({
        [theme.grid]: true,
        [className]: className && className.length
    });

    return (
        <div {...rest} className={finalClassName}>
            {children}
        </div>
    );
};
Grid.propTypes = {
    children: PropTypes.any.isRequired,
    className: PropTypes.string,
    theme: PropTypes.shape({
        grid: PropTypes.string
    }).isRequired
};

export default Grid;
