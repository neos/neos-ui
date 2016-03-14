import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Shared/Utilities/index';
import style from './style.css';

export default (props, children) => {
    props = Object.assign({
        className: '',
        isFocused: false,
        isDisabled: false,
        style: 'clean',
        hoverStyle: 'clean',
        onClick: () => {},
        onMouseDown: () => {},
        onMouseUp: () => {},
        onMouseEnter: () => {},
        onMouseLeave: () => {}
    }, props);

    return h('button', {
        className: mergeClassNames({
            [style.btn]: true,
            [style['btn--clean']]: props.style === 'clean',
            [style['btn--transparent']]: props.style === 'transparent',
            [style['btn--cleanHover']]: props.hoverStyle === 'clean',
            [style['btn--brandHover']]: props.hoverStyle === 'brand',
            [style['btn--darkenHover']]: props.hoverStyle === 'darken',
            [props.className]: props.className && props.className.length
        }),
        onclick: e => executeCallback({e, cb: props.onClick}),
        onmousedown: e => executeCallback({e, cb: props.onMouseDown}),
        onmouseup: e => executeCallback({e, cb: props.onMouseUp}),
        onmouseenter: e => executeCallback({e, cb: props.onMouseEnter}),
        onmouseleave: e => executeCallback({e, cb: props.onMouseLeave}),
        ref: btn => {
            const method = props.isFocused ? 'focus' : 'blur';

            //
            // Initially focus the btn if the propType was set.
            //
            if (btn !== null) {
                btn[method]();
            }
        },
        disabled: props.isDisabled ? 'disabled' : ''
    }, children);
};
