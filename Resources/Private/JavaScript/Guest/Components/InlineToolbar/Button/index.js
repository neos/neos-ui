import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';

import style from './style.css';
import icons from './icons.css';

export default ({icon, annotation, onClick, onMouseDown, onMouseLeave}) => h('button', {
    className: mergeClassNames({
        [style.btn]: true,
        [style['btn--clean']]: true
    }),
    onclick: e => {
        e.stopPropagation();
        if (onClick) {
            onClick();
        }
    },
    onmousedown: e => {
        e.stopPropagation();
        if (onMouseDown) {
            onMouseDown();
        }
    },
    onmouseleave: e => {
        e.stopPropagation();
        if (onMouseLeave) {
            onMouseLeave();
        }
    }
},
    [
        //
        // Render the main icon
        //
        h('i', {
            className: mergeClassNames({
                [style.btn__icon]: true,
                [icons[icon]]: true
            })
        }),

        //
        // Render the annotation icon, if any
        //
        annotation && h('i', {
            className: mergeClassNames({
                [style.btn__annotation]: true,
                [icons[annotation]]: true
            })
        })
    ]
);
