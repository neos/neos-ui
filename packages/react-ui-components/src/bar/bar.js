import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import executeCallback from './../_lib/executeCallback.js';

const Bar = props => {
    const {position, className, onDrop, theme} = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.bar]: true,
        [theme['bar--top']]: position === 'top',
        [theme['bar--bottom']]: position === 'bottom'
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
    theme: PropTypes.shape({
        'bar': PropTypes.string,
        'bar--top': PropTypes.string,
        'bar--bottom': PropTypes.string
    }).isRequired,
    className: PropTypes.string,

    // Contents of the Bar.
    children: PropTypes.node.isRequired,

    // Interaction related propTypes.
    onDrop: PropTypes.func
};
Bar.defaultProps = {
    style: {}
};

export default Bar;
