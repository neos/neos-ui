import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';

import button from '../Button/';

import style from './style.css';

const defaultState = {
    activeButton: 0,
    isOpen: false
};

export default ({buttons, onUpdate}, state = defaultState) => {
    let mouseHoldTimeout = null;

    return h('div', {
        className: mergeClassNames({
            [style.wrapper]: true
        })
    }, [
        //
        // Render the active button
        //
        button(Object.assign({}, buttons[state.activeButton], {
            onClick: () => {
                clearTimeout(mouseHoldTimeout);
                if (!state.isOpen) {
                    buttons[state.activeButton].onClick();
                }
            },
            onMouseDown: () => {
                mouseHoldTimeout = setTimeout(() => onUpdate(state.activeButton, true), 200);
            },
            onMouseLeave: () => clearTimeout(mouseHoldTimeout)
        })),

        //
        // Render the button dropdown
        //
        h('div', {
            className: mergeClassNames({
                [style.wrapper__dropDown]: true,
                [style['wrapper__dropDown--isOpen']]: state.isOpen
            })
        }, [
            ...buttons.map((b, i) => button({
                icon: b.annotation,
                onClick: () => onUpdate(i, false)
            }))
        ])
    ]);
};
