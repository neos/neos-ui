import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';

const Grid = props => {
    const {className, children} = props;
    const classNames = mergeClassNames({
        [style.grid]: true,
        [className]: className && className.length
    });

    return (
        <div className={classNames}>
            {children}
        </div>
    );
};
Grid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Grid;
