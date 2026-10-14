import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import style from './style.module.css';

//
// Get all parent elements of the event target.
//
// It's not possible to use `event.composedPath()` here because
// it doesn't work in FF with past events stored in a closure.
//
const eventPath = event => {
    let element = event.target;
    const path = [];

    while (element) {
        path.push(element);
        if (element.tagName === 'HTML') {
            path.push(document);
            path.push(window);
            return path;
        }
        element = element.parentElement;
    }
    return path;
};

//
// Registers the hover highlighting and the node selection of content nodes within the guest frame.
//
// Hover highlighting and selection are handled by delegated listeners on the guest frame document
// instead of listeners on every single content node.
//
export default ({store, guestFrameDocument}) => {
    let hoveredContentDomNode = null;

    guestFrameDocument.addEventListener('mouseover', e => {
        const contentDomNode = e.target.closest('[data-__neos-node-contextpath]');

        if (!contentDomNode || contentDomNode === hoveredContentDomNode) {
            return;
        }

        // Still inside the previously hovered node, for instance when moving between two of its children
        if (hoveredContentDomNode && hoveredContentDomNode.contains(e.relatedTarget)) {
            return;
        }

        if (hoveredContentDomNode) {
            hoveredContentDomNode.classList.remove(style.markHoveredNodeAsHovered);
        }

        hoveredContentDomNode = contentDomNode;
        hoveredContentDomNode.classList.add(style.markHoveredNodeAsHovered);
    });

    guestFrameDocument.addEventListener('mouseout', e => {
        const contentDomNode = e.target.closest('[data-__neos-node-contextpath]');

        if (!contentDomNode || contentDomNode !== hoveredContentDomNode) {
            return;
        }

        // Still inside the hovered node, for instance when moving between two of its children
        if (e.relatedTarget && contentDomNode.contains(e.relatedTarget)) {
            return;
        }

        contentDomNode.classList.remove(style.markHoveredNodeAsHovered);
        hoveredContentDomNode = null;
    });

    const focusSelectedNode = event => {
        const clickPath = Array.prototype.slice.call(eventPath(event));
        const isInsideInlineUi = clickPath.some(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos__inline-ui')
        );
        const isInsideEditableProperty = clickPath.some(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos-property')
        );
        const selectedDomNode = clickPath.find(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos-node-contextpath')
        );

        if (isInsideInlineUi) {
            // Do nothing, everything OK!
        } else if (selectedDomNode) {
            const contextPath = selectedDomNode.getAttribute('data-__neos-node-contextpath');
            const fusionPath = selectedDomNode.getAttribute('data-__neos-fusion-path');
            const state = store.getState();
            const focusedNodeContextPath = selectors.CR.Nodes.focusedNodePathSelector(state);
            if (!isInsideEditableProperty) {
                store.dispatch(actions.UI.ContentCanvas.setCurrentlyEditedPropertyName(''));
            }
            if (!isInsideEditableProperty || focusedNodeContextPath !== contextPath) {
                store.dispatch(actions.CR.Nodes.focus(contextPath, fusionPath));
            }
        } else {
            store.dispatch(actions.UI.ContentCanvas.setCurrentlyEditedPropertyName(''));
            store.dispatch(actions.CR.Nodes.unFocus());
        }
    };

    // We store the original mousedown event in order to prevent bugs like this: https://github.com/neos/neos-ui/issues/1934
    let mouseDownEvent = null;
    guestFrameDocument.addEventListener('mousedown', event => {
        mouseDownEvent = event;
    });
    guestFrameDocument.addEventListener('mouseup', () => {
        if (mouseDownEvent) {
            focusSelectedNode(mouseDownEvent);
        }
        mouseDownEvent = null;
    });

    guestFrameDocument.addEventListener('keyup', e => {
        if (e.key === 'Tab') {
            focusSelectedNode(e);
        }
    });
};
