import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';

import icon from 'Guest/Components/Icon/';
import button from 'Guest/Components/Button/';

import style from './style.css';

let mouseholdTimeout = null;

const modeIconMap = {
    into: 'fa-long-arrow-right',
    before: 'fa-long-arrow-up',
    after: 'fa-long-arrow-down'
};

export default (props, children) => {
    props = Object.assign({
        icon: '',
        mode: 'into',
        className: '',
        isDisabled: false,
        isOpened: false,
        onClick: () => {},
        onItemSelect: () => {},
        onUpdate: () => {}
    }, props);

    return h('div', {
        className: mergeClassNames({
            [style.wrapper]: true,
            [props.className]: props.className && props.className.length
        })
    }, [
        button({
            isDisabled: props.isDisabled,
            onClick: () => {
                if (mouseholdTimeout) {
                    clearTimeout(mouseholdTimeout);
                } else {
                    props.onClick(props.mode);
                }
            },
            className: style.wrapper__btn,
            onMouseDown: () => {
                mouseholdTimeout = setTimeout(() => {
                    if (props.onUpdate) {
                        props.onUpdate({...props, isOpened: true});
                    }
                }, 200);
            }
        }, [
            icon({icon: modeIconMap[props.mode], className: style.wrapper__btnModeIcon}),
            icon({icon: props.icon})
        ]),
        h('div', {
            className: mergeClassNames({
                [style.wrapper__dropDown]: true,
                [style['wrapper__dropDown--isOpen']]: props.isOpened
            })
        }, children)
    ]);
};
