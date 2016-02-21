import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';

import {position} from 'Guest/Process/DOMUtils.js';
import iconButton from 'Guest/Components/IconButton/';
import iconButtonDropDown from 'Guest/Components/IconButtonDropDown/';

import style from './style.css';

const setButtonMode = (button, mode, props) => () => {
    const newProps = Object.assign({}, props);
    newProps.buttons[button].mode = mode;
    newProps.buttons[button].isOpened = false;
    props.onUpdate(newProps);
};

let savedProps = {};

export default props => {
    props = Object.assign({
        node: null,
        typoscriptPath: '',
        buttons: {
            create: {
                mode: 'into',
                isDisabled: false,
                isOpen: false
            },
            paste: {
                mode: 'into',
                isDisabled: false,
                isOpen: false
            }
        },
        onUpdate: () => {}
    }, savedProps, props);
    savedProps = props;

    const dom = props.node && document.querySelector(
        `[data-__che-typoscript-path="${props.typoscriptPath}"][data-__che-node-contextpath="${props.node.contextPath}"]`
    );
    const {x, y} = position(dom);

    return h('div', {
        onclick: e => e.stopPropagation(),
        className: mergeClassNames({
            [style.toolbar]: true,
            [style['toolbar--isVisible']]: Boolean(dom)
        }),
        style: {
            top: `${(y - 49)}px`,
            left: `${(x - 9)}px`
        }
    }, [
        //
        // Create Button
        //
        iconButtonDropDown({
            ...props.buttons.create,
            icon: 'fa-plus',
            onUpdate: buttonProps => {
                const newProps = Object.assign({}, props);
                newProps.buttons.create = buttonProps;
                props.onUpdate(newProps);
            },
            onClick: mode => {
                switch (mode) {
                    case 'into':
                        console.log('create into');
                        break;

                    case 'before':
                        console.log('create before');
                        break;

                    case 'after':
                    default:
                        console.log('create after');
                        break;
                }
            }
        }, [
            iconButton({
                icon: 'fa-long-arrow-up',
                onClick: setButtonMode('create', 'before', props)
            }),
            iconButton({
                icon: 'fa-long-arrow-right',
                onClick: setButtonMode('create', 'into', props)
            }),
            iconButton({
                icon: 'fa-long-arrow-down',
                onClick: setButtonMode('create', 'after', props)
            })
        ]),

        //
        // Hide / unhide button
        //
        iconButton({
            icon: 'fa-eye-slash',
            onClick: () => console.log('hide')
        }),

        //
        // Copy button
        //
        iconButton({
            icon: 'fa-copy',
            onClick: () => console.log('copy')
        }),

        //
        // Cut button
        //
        iconButton({
            icon: 'fa-cut',
            onClick: () => console.log('cut')
        }),

        //
        // Paste button
        //
        iconButton({
            icon: 'fa-paste',
            onClick: () => console.log('paste')
        }),

        //
        // Delete button
        //
        iconButton({
            icon: 'fa-trash',
            onClick: () => console.log('delete')
        })
    ]);
};
