import compose from 'lodash.compose';

import {
    handle,
    handleOutside,
    stopPropagation,
    preventDefault
} from 'Guest/Process/DOMUtils.js';

import style from './style.css';

export default (el, ui, connection) => {
    const contextPath = el.dataset.__cheNodeContextpath;
    const typoscriptPath = el.dataset.__cheTyposcriptPath;

    el.classList.add(style.node);

    //
    // React on guest events
    //
    compose(
        handle('click', () => ui.focusNode(contextPath, typoscriptPath), stopPropagation, preventDefault),
        handleOutside('click', () => ui.blurNode(contextPath, typoscriptPath)),
        handle('mouseover', () => ui.hoverNode(contextPath, typoscriptPath), stopPropagation),
        handle('mouseout', () => ui.unhoverNode(contextPath, typoscriptPath))
    )(el);

    //
    // Observe host state
    //
    const isCurrentNode = res => (
        res.node &&
        res.node.contextPath === contextPath &&
        res.typoscriptPath === typoscriptPath
    );

    connection.observe('nodes.focused').react(res => {
        if (isCurrentNode(res)) {
            el.classList.add(style['node--focused']);
        } else {
            el.classList.remove(style['node--focused']);
        }
    });

    connection.observe('nodes.hovered').react(res => {
        if (isCurrentNode(res)) {
            el.classList.add(style['node--hover']);
        } else {
            el.classList.remove(style['node--hover']);
        }
    });
};
