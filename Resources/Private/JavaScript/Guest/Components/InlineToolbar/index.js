import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';
import createElement from 'virtual-dom/create-element';
import mergeClassNames from 'classnames';

import {events} from 'Shared/Constants/';

import style from './style.css';
import button from './Button/';
import buttonDropDown from './ButtonDropDown/';

const {HOST_NODE_FOCUSED, HOST_NODE_BLURRED} = events;

const {broadcast} = window.neos;

const position = dom => {
    if (dom !== null) {
        const bodyBounds = document.body.getBoundingClientRect();
        const domBounds = dom.getBoundingClientRect();

        return {
            x: domBounds.left - bodyBounds.left,
            y: domBounds.top - bodyBounds.top
        };
    }

    return {x: 0, y: 0};
};

export default (ui, connection) => {
    const defaultState = {
        create: {
            activeButton: 0,
            isOpen: false
        },
        paste: {
            activeButton: 0,
            isOpen: false
        }
    };
    const render = (update, node = null, typoscriptPath = '', state = defaultState) => {
        const dom = node && document.querySelector(`[data-__che-typoscript-path="${typoscriptPath}"][data-__che-node-contextpath="${node.contextPath}"]`);
        const {x, y} = position(dom);

        return h('div', {
            className: mergeClassNames({
                [style.toolbar]: true
            }),
            style: {
                display: Boolean(dom) ? 'block' : 'none',
                top: `${(y - 49)}px`,
                left: `${(x - 9)}px`
            }
        }, [
            buttonDropDown({
                buttons: [
                    {
                        icon: 'fa-plus',
                        annotation: 'fa-long-arrow-up',
                        onClick: () => console.log('Create before Node dialog')
                    },
                    {
                        icon: 'fa-plus',
                        annotation: 'fa-long-arrow-right',
                        onClick: () => console.log('Create into Node dialog')
                    },
                    {
                        icon: 'fa-plus',
                        annotation: 'fa-long-arrow-down',
                        onClick: () => console.log('Create after Node dialog')
                    }
                ],
                onUpdate: (activeButton, isOpen) => {
                    update(node, typoscriptPath, Object.assign({}, state, {create: {activeButton, isOpen}}));
                }
            }, state.create),
            button({
                icon: 'fa-eye-slash',
                onClick: () => console.log('Hide node')
            }),
            button({
                icon: 'fa-copy',
                onClick: () => console.log('Copy node')
            }),
            button({
                icon: 'fa-cut',
                onClick: () => console.log('Cut node')
            }),
            button({
                icon: 'fa-paste',
                onClick: () => console.log('Paste node')
            }),
            button({
                icon: 'fa-trash',
                onClick: () => console.log('Delete node')
            })
        ]);
    };
    let toolbar = render();
    const toolbarNode = createElement(toolbar);
    const update = (node = null, typoscriptPath = '', state = defaultState) => {
        const newToolbar = render(update, node, typoscriptPath, state);
        patch(toolbarNode, diff(toolbar, newToolbar));
        toolbar = newToolbar;
    };

    //
    // Listen to Host events
    //
    connection.observe('nodes.focused').react(res => {
        if (res.node) {
            update(res.node, res.typoscriptPath);
            return;
        }

        update();
    });

    return toolbarNode;
};
