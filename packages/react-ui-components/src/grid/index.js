import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
// import style from './style.css';

const Grid = props => {
    const {className, children, style, ...rest} = props;
    const finalClassName = mergeClassNames({
        [style.grid]: true,
        [className]: className && className.length
    });

    return (
        <div {...rest} className={finalClassName}>
            {children}
        </div>
    );
};
Grid.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
};
Grid.defaultProps = {
    style: {}
};

export default Grid;
