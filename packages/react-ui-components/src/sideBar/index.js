import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
// import style from './style.css';

const SideBar = props => {
    const {
        position,
        className,
        children,
        style,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.sideBar]: true,
        [style['sideBar--left']]: position === 'left',
        [style['sideBar--right']]: position === 'right'
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
    style: PropTypes.object
};
SideBar.defaultProps = {
    style: {}
};

export default SideBar;
