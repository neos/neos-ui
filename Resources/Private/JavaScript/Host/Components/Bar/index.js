import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Shared/Utilities/index';
import style from './style.css';

const Bar = props => {
    const {position, className, onDrop} = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.bar]: true,
        [style['bar--top']]: position === 'top',
        [style['bar--bottom']]: position === 'bottom'
    });

    return (
        <div
            className={classNames}
            onDragOver={e => executeCallback({e, preventDefault: true})}
            onDrop={e => executeCallback({e, cb: onDrop, preventDefault: true})}
            >
          {props.children}
        </div>
    );
};
Bar.propTypes = {
    // Style related propTypes.
    position: PropTypes.oneOf(['top', 'bottom']).isRequired,
    className: PropTypes.string,

    // Contents of the Bar.
    children: PropTypes.node.isRequired,

    // Interaction related propTypes.
    onDrop: PropTypes.func
};

export default Bar;
