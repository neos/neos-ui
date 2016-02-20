import compose from 'lodash.compose';

import {events} from 'Shared/Constants/';
import {
    handle,
    handleOutside,
    stopPropagation,
    preventDefault
} from 'Guest/Process/DOMUtils.js';

import style from './style.css';

const {
    GUEST_NODE_FOCUSED,
    GUEST_NODE_BLURRED,
    GUEST_NODE_MOUSEENTERED,
    GUEST_NODE_MOUSELEFT,

    HOST_NODE_FOCUSED,
    HOST_NODE_BLURRED,
    HOST_NODE_MOUSEENTERED,
    HOST_NODE_MOUSELEFT
} = events;

const {broadcast} = window.neos;

export default (el, ui, connection) => {
    const contextPath = el.dataset.__cheNodeContextpath;
    const typoscriptPath = el.dataset.__cheTyposcriptPath;
    const nodeEvent = topic => [topic, contextPath].join('.');
    const events = {
        guest: {
            focused: nodeEvent(GUEST_NODE_FOCUSED),
            blurred: nodeEvent(GUEST_NODE_BLURRED),
            mouseentered: nodeEvent(GUEST_NODE_MOUSEENTERED),
            mouseleft: nodeEvent(GUEST_NODE_MOUSELEFT)
        },
        host: {
            blurred: nodeEvent(HOST_NODE_BLURRED),
            mouseentered: nodeEvent(HOST_NODE_MOUSEENTERED),
            mouseleft: nodeEvent(HOST_NODE_MOUSELEFT)
        }
    };

    el.classList.add(style.node);

    //
    // Publish guest events
    //

    compose(
        handle('click', () => ui.focusNode(contextPath, typoscriptPath), stopPropagation, preventDefault),
        handleOutside('click', () => ui.blurNode(contextPath, typoscriptPath)),
        handle('mouseover', () => ui.hoverNode(contextPath, typoscriptPath), stopPropagation),
        handle('mouseout', () => ui.unhoverNode(contextPath, typoscriptPath))
    )(el);

    //
    // Subscribe to host events
    //

    connection.observe('nodes.focused').react(res => {
        if (res.node) {
            if (res.node.contextPath === contextPath && typoscriptPath === res.typoscriptPath) {
                el.classList.add(style['node--focused']);
                return;
            }
        }

        el.classList.remove(style['node--focused']);
    });

    connection.observe('nodes.hovered').react(res => {
        if (res.node) {
            if (res.node.contextPath === contextPath && typoscriptPath === res.typoscriptPath) {
                el.classList.add(style['node--hover']);
                return;
            }
        }
        el.classList.remove(style['node--hover']);
    });
};
