import h from 'virtual-dom/h';
import mergeClassNames from 'classnames';

import iconButton from 'Guest/Components/IconButton/index';

import style from './style.css';

let singleton = null;
const componentMap = {
    button: iconButton
};

export default () => {
    let savedProps = {};

    if (singleton) {
        return singleton;
    }

    singleton = props => {
        props = Object.assign({
            isVisible: false,
            position: {
                x: 0,
                y: 0
            },
            buttons: {
                bold: {
                    type: 'button',
                    props: {
                        icon: 'fa-bold',
                        onClick: () => console.log('bold')
                    }
                },
                italic: {
                    type: 'button',
                    props: {
                        icon: 'fa-italic',
                        onClick: () => console.log('italic')
                    }
                }
            }
        }, savedProps, props);
        savedProps = props;

        const {isVisible, buttons} = props;
        const {x, y} = props.position;

        return h('div', {
            onclick: e => e.stopPropagation(),
            className: mergeClassNames({
                [style.toolbar]: true,
                [style['toolbar--isVisible']]: isVisible
            }),
            style: {
                top: `${(y - 49)}px`,
                left: `${(x - 9)}px`
            }
        }, Object.keys(buttons).map(k => buttons[k]).map(button => {
            const {type, props} = button;

            // TODO: add error handling
            const component = componentMap[type];
            return component(props);
        }));
    };

    return singleton;
};
