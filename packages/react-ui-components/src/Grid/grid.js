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
    /**
    * The contents to be rendered, ideally `Grid.Col`.
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
        grid: PropTypes.string
    }).isRequired
};

export default Grid;
