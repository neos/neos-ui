import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from '../../Abstracts/';
import style from './style.css';

export default class Button extends Component {
    static propTypes = {
        className: PropTypes.string,
        isFocused: PropTypes.bool,
        isDisabled: PropTypes.bool,
        textAlign: PropTypes.oneOf(['left', 'center']),
        width: PropTypes.oneOf(['auto', 'full']),
        style: PropTypes.oneOf(['clean', 'transparent']),
        hoverStyle: PropTypes.oneOf(['clean', 'brand', 'darken']),
        onClick: PropTypes.func.isRequired,
        onMouseDown: PropTypes.func,
        onMouseUp: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        children: PropTypes.node.isRequired
    }

    render() {
        const {
            children,
            className,
            isFocused,
            isDisabled,
            onClick,
            onMouseDown,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
            hoverStyle,
            width,
            textAlign
        } = this.props;
        const classNames = mergeClassNames({
            [style.btn]: true,
            [style['btn--clean']]: this.props.style === 'clean',
            [style['btn--transparent']]: this.props.style === 'transparent',
            [style['btn--cleanHover']]: hoverStyle === 'clean',
            [style['btn--brandHover']]: hoverStyle === 'brand',
            [style['btn--darkenHover']]: hoverStyle === 'darken',
            [style['btn--full']]: width === 'full',
            [style['btn--textAlignLeft']]: textAlign === 'left',
            [className]: className && className.length
        });
        const props = {
            className: classNames,
            onClick: e => executeCallback(e, onClick),
            onMouseDown: e => executeCallback(e, onMouseDown),
            onMouseUp: e => executeCallback(e, onMouseUp),
            onMouseEnter: e => executeCallback(e, onMouseEnter),
            onMouseLeave: e => executeCallback(e, onMouseLeave),
            ref: btn => {
                const method = isFocused ? 'focus' : 'blur';

                // Initially focus the btn if the propType was set.
                if (btn !== null) {
                    btn[method]();
                }
            }
        };

        // Disable the btn if the prop was set.
        if (isDisabled) {
            props.disabled = 'disabled';
        }

        return (
            <button {...props}>
                {children}
            </button>
        );
    }
}
Button.defaultProps = {
    style: 'clean',
    hoverStyle: 'clean',
    isFocused: false,
    isDisabled: false
};
