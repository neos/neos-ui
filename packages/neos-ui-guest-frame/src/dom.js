//
// Helper functions for dom operations within the guest frame.
// Functions are curried, to enable lazy execution.
//
import animate from 'amator';

import style from './style.css';

//
// Get the guest frame's document object
//
export const getGuestFrameDocument = () => {
    return document.getElementsByName('neos-content-main')[0].contentDocument;
};

//
// Get the guest frame's window object
//
export const getGuestFrameWindow = () => {
    return document.getElementsByName('neos-content-main')[0].contentWindow;
};

//
// Get the guest frame's body DOM node
//
export const getGuestFrameBody = () => getGuestFrameDocument().body;

//
// Find a DOM node for the given selector in the guest frame
//
export const findInGuestFrame = selector =>
    getGuestFrameDocument().querySelector(selector);

//
// Find all DOM nodes for the given selector in the guest frame
//
export const findAllInGuestFrame = selector =>
    [].slice.call(getGuestFrameDocument().querySelectorAll(selector));

//
// Find all DOM nodes that represent CR nodes in the guest frame
//
export const findAllNodesInGuestFrame = () =>
    findAllInGuestFrame('[data-__neos-node-contextpath]');

//
// Find all DOM nodes that represent CR node properties in the guest frame
//
export const findAllPropertiesInGuestFrame = () =>
    findAllInGuestFrame('[data-__neos-property]');

//
// Find all DOM nodes that represent CR node properties in the guest frame
//
export const findRelativePropertiesInGuestFrame = contentDomNode =>
    [].slice.call(contentDomNode.querySelectorAll(
        `[data-__neos-property][data-__neos-editable-node-contextpath="${contentDomNode.getAttribute('data-__neos-node-contextpath')}"]`
    )).concat(...(
        contentDomNode.hasAttribute('data-__neos-property') ?
            [contentDomNode] : []
    ));

//
// Find a specific DOM node that represents a CR node in the guest frame
//
export const findNodeInGuestFrame = (contextPath, fusionPath) => fusionPath ? findInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"][data-__neos-fusion-path="${fusionPath}"]`
) : findInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"]`
);

//
// Find all DOM nodes that represent a CR node identified by context path and
// fusion path in the guest frame
//
export const findAllOccurrencesOfNodeInGuestFrame = (contextPath, fusionPath) => fusionPath ? findAllInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"][data-__neos-fusion-path="${fusionPath}"]`
) : findAllInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"]`
);

//
// Find all rendered childnodes beneath a given DOM ndoe
//
export const findAllChildNodes = el => [].slice.call(el.querySelectorAll('[data-__neos-node-contextpath]'));

//
// Find the closest DOM node that represents a CR node relative to the given DOM node
// in the guest frame
//
export const closestNodeInGuestFrame = el => {
    if (!el || !el.dataset) {
        // el.dataset is not existing for window.document; and we need to prevent this case from happening.
        return null;
    }

    return el.dataset.__neosNodeContextpath ? el : closestNodeInGuestFrame(el.parentNode);
};

//
// Get the context path from the closest DOM node that represents a CR node relative to the
// given DOM node in the guest frame
//
export const closestContextPathInGuestFrame = el => {
    const dom = closestNodeInGuestFrame(el);

    if (!dom) {
        return null;
    }

    return dom.dataset.__neosNodeContextpath;
};

//
// Add hidden class to a DOM node that represents a CR node
//
export const markNodeAsHidden = contextPath => {
    const domNode = findNodeInGuestFrame(contextPath);

    if (domNode) {
        domNode.classList.add(style.markHiddenNodeAsHidden);
    }
};

//
// Remove hidden class from a DOM node that represents a CR node
//
export const markNodeAsVisible = contextPath => {
    const domNode = findNodeInGuestFrame(contextPath);

    if (domNode) {
        domNode.classList.remove(style.markHiddenNodeAsHidden);
    }
};

//
// Insert a placeholder element for content collections that don't have
// any children yet
//
export const createEmptyContentCollectionPlaceholderIfMissing = collectionDomNode => {
    if (collectionDomNode) {
        const hasChildNodes = Boolean(
            collectionDomNode.querySelector('[data-__neos-node-contextpath]')
        );
        const hasEmptyContentCollectionOverlay = Boolean(
            collectionDomNode.querySelector(`.${style.addEmptyContentCollectionOverlay}`)
        );

        if (!hasChildNodes && !hasEmptyContentCollectionOverlay) {
            const emptyContentCollectionOverlay = document.createElement('div');
            emptyContentCollectionOverlay.setAttribute('class', style.addEmptyContentCollectionOverlay);
            collectionDomNode.appendChild(emptyContentCollectionOverlay);
        }
    }
};

//
// Get the horizontal scrolloffset of the guest frame
//
export const getGuestFrameScrollOffsetX = () => {
    const iframeWindow = getGuestFrameWindow();
    const iframeDocument = getGuestFrameDocument();

    return iframeWindow.scrollX || iframeWindow.pageXOffset || iframeDocument.body.scrollLeft;
};

//
// Get the vertical scrolloffset of the guest frame
//
export const getGuestFrameScrollOffsetY = () => {
    const iframeWindow = getGuestFrameWindow();
    const iframeDocument = getGuestFrameDocument();

    return iframeWindow.scrollY || iframeWindow.pageYOffset || iframeDocument.body.scrollTop;
};

//
// Get the absolute position of an element in the guest frame
//
export const getAbsolutePositionOfElementInGuestFrame = element => {
    if (element && element.getBoundingClientRect) {
        const relativeDocumentDimensions = getGuestFrameDocument().documentElement.getBoundingClientRect();
        const relativeElementDimensions = element.getBoundingClientRect();

        return {
            top: relativeElementDimensions.top - relativeDocumentDimensions.top,
            left: relativeElementDimensions.left - relativeDocumentDimensions.left,
            bottom: relativeDocumentDimensions.bottom - relativeElementDimensions.bottom,
            right: relativeDocumentDimensions.right - relativeElementDimensions.right
        };
    }

    return {top: 0, left: 0, bottom: 0, right: 0};
};

//
// Checks whether the given element is visible to the user
// in the guest frame
//
export const isElementVisibleInGuestFrame = (element, offsetY = 0, offsetX = 0) => {
    const {innerHeight, innerWidth} = getGuestFrameWindow();
    const {top, left, bottom, right} = element.getBoundingClientRect();
    const isVisibleOnYAxis = top >= offsetY && bottom + offsetY <= innerHeight;
    const isVisibleOnXAxis = left >= offsetX && right + offsetX <= innerWidth;

    return isVisibleOnYAxis && isVisibleOnXAxis;
};

//
// Animate scroll to a given position in the guest frame
//
export const animateScrollToPositionInGuestFrame = (x, y) => {
    const initialState = {
        x: getGuestFrameScrollOffsetX(),
        y: getGuestFrameScrollOffsetY()
    };
    const iframeWindow = getGuestFrameWindow();

    animate(initialState, {x, y}, {
        step: ({x, y}) => iframeWindow.scrollTo(x, y)
    });
};

//
// Animate scroll to a given element in the guest frame
//
export const animateScrollToElementInGuestFrame = (element, offsetY = 0, offsetX = 0) => {
    const {top, left} = getAbsolutePositionOfElementInGuestFrame(element);

    animateScrollToPositionInGuestFrame(left - offsetX, top - offsetY);
};
