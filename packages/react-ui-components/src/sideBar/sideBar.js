import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const SideBar = props => {
    const {
        position,
        className,
        children,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.sideBar]: true,
        [theme['sideBar--left']]: position === 'left',
        [theme['sideBar--right']]: position === 'right'
    });

    return (
        <div {...rest} className={classNames}>
          {children}
        </div>
    );
};
SideBar.propTypes = {
    position: PropTypes.oneOf(['left', 'right']).isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'sideBar': PropTypes.string,
        'sideBar--left': PropTypes.string,
        'sideBar--right': PropTypes.string
    }).isRequired
};

export default SideBar;
