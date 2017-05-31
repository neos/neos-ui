import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const GridItem = props => {
    const {
        className,
        children,
        width,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [theme.grid__item]: true,
        [className]: className && className.length
    });
    const inlineStyle = {
        width: width === 'half' ? '50%' : '33.33%'
    };

    return (
        <div {...rest} className={classNames} style={inlineStyle}>
            {children}
        </div>
    );
};
GridItem.propTypes = {
    /**
     * The allowed widths of the grid col.
     * Since we don't want to get the grids get out of control,
     * we specify a only a subset of widths.
     */
    width: PropTypes.oneOf(['half', 'third']).isRequired,

    /**
    * The contents to be rendered within the GridCol
    */
    children: PropTypes.any.isRequired,

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        grid__item: PropTypes.string // eslint-disable-line camelcase
    }).isRequired
};

export default GridItem;
