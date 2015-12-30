import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import style from './style.css';

export default class Button extends Component {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.oneOf(['clean', 'transparent']),
        hoverStyle: PropTypes.oneOf(['clean', 'brand']),
        onClick: PropTypes.func.isRequired,
        onMouseDown: PropTypes.func,
        onMouseUp: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        children: PropTypes.node.isRequired
    }

    render() {
        const {
            className,
            children,
            onClick,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
            onMouseLeave
        } = this.props;
        const classNames = mergeClassNames({
            [style.btn]: true,
            [style['btn--clean']]: this.props.style === 'clean',
            [style['btn--transparent']]: this.props.style === 'transparent',
            [style['btn--cleanHover']]: this.props.hoverStyle === 'clean',
            [style['btn--brandHover']]: this.props.hoverStyle === 'brand',
            [className]: true
        });

        return (
            <button
                className={classNames}
                onClick={e => executeCallback(e, onClick)}
                onMouseDown={e => executeCallback(e, onMouseDown)}
                onMouseUp={e => executeCallback(e, onMouseUp)}
                onMouseEnter={e => executeCallback(e, onMouseEnter)}
                onMouseLeave={e => executeCallback(e, onMouseLeave)}
                >
                {children}
            </button>
        );
    }
}
Button.defaultProps = {
    style: 'clean',
    hoverStyle: 'clean'
};
