import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const GridItem = props => {
    const {className, children, width, theme} = props;
    const classNames = mergeClassNames({
        [theme.grid__item]: true,
        [className]: className && className.length
    });
    const inlineStyle = {
        width: width === 'half' ? '50%' : '33.33%'
    };

    return (
        <div className={classNames} style={inlineStyle}>
            {children}
        </div>
    );
};
GridItem.propTypes = {
    // Since we don't want to get the grids get out of control,
    // we specify a set of allowed widths here.
    width: PropTypes.oneOf(['half', 'third']).isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    theme: PropTypes.shape({
        grid__item: PropTypes.string // eslint-disable-line camelcase
    }).isRequired
};

export default GridItem;
