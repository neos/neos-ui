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

export default el => {
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
        handle('click', () => broadcast.publish(events.guest.focused, {contextPath, typoscriptPath}), stopPropagation, preventDefault),
        handleOutside('click', () => broadcast.publish(events.guest.blurred, {contextPath, typoscriptPath})),
        handle('mouseover', () => broadcast.publish(events.guest.mouseentered, {contextPath, typoscriptPath}), stopPropagation),
        handle('mouseout', () => broadcast.publish(events.guest.mouseleft, {contextPath, typoscriptPath}))
    )(el);

    //
    // Subscribe to host events
    //

    broadcast.subscribe(HOST_NODE_FOCUSED, (event, payload) => {
        if (payload.node.contextPath === contextPath) {
            el.classList.add(style['node--focused']);
        } else {
            broadcast.publish(events.guest.blurred, {contextPath, typoscriptPath});
        }
    });

    broadcast.subscribe(events.host.blurred, () => el.classList.remove(style['node--focused']));
    broadcast.subscribe(events.host.mouseentered, () => el.classList.add(style['node--hover']));
    broadcast.subscribe(events.host.mouseleft, () => el.classList.remove(style['node--hover']));
};
