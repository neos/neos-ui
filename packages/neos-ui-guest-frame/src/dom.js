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
    const guestFrame = document.getElementsByName('neos-content-main')[0];
    return guestFrame && guestFrame.contentDocument;
};

//
// Get the guest frame's window object
//
export const getGuestFrameWindow = () => {
    const guestFrame = document.getElementsByName('neos-content-main')[0];
    return guestFrame && guestFrame.contentWindow;
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
// Find all DOM nodes that represent a particular node property in the guest frame
//
export const findAllOccurrencesOfNodePropertyInGuestFrame = (contextPath, propertyName) => findAllInGuestFrame(`[data-__neos-editable-node-contextpath="${contextPath}"][data-__neos-property="${propertyName}"]`);

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
// any children yet and have a very small height (as they would not be clickable / selectable otherwise).
// NOTE: If the element is "big enough" (i.e. more than 20 px), we do not render the placeholder either; as then
// the user will very likely have created his own rendering.
export const createEmptyContentCollectionPlaceholderIfMissing = collectionDomNode => {
    if (collectionDomNode) {
        const hasChildNodes = Boolean(
            collectionDomNode.querySelector('[data-__neos-node-contextpath]')
        );
        const heightOfContentCollection = collectionDomNode.getBoundingClientRect().height;

        const hasEmptyContentCollectionOverlay = Boolean(
            collectionDomNode.querySelector(`.${style.addEmptyContentCollectionOverlay}`)
        );

        if (!hasChildNodes && !hasEmptyContentCollectionOverlay && heightOfContentCollection < 20) {
            const emptyContentCollectionOverlay = document.createElement('div');
            emptyContentCollectionOverlay.setAttribute('class', style.addEmptyContentCollectionOverlay);
            collectionDomNode.appendChild(emptyContentCollectionOverlay);
        }
    }
};

//
// Create an overlay that indicates that the related content
// cannot be edited
//
export const createNotInlineEditableOverlay = contentDomNode => {
    const initialCssPosition = getComputedStyle(contentDomNode).position;

    if (initialCssPosition === 'static') {
        contentDomNode.style.position = 'relative';
    }

    const notInlineEditableOverlay = document.createElement('div');
    notInlineEditableOverlay.setAttribute('class', style.notInlineEditableOverlay);

    contentDomNode.appendChild(notInlineEditableOverlay);
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

/**
 * returns the clamped N, and the amount how much N has been clamped.
 */
const clampNumber = (n, min, max) => {
    if (max < min) {
        max = min;
    }

    if (n < min) {
        return [min, min - n];
    }
    if (n > max) {
        return [max, n - max];
    }
    return [n, 0];
};

// We export this function only for testing.
export const clampElementToDocumentDimensions = (elementDimensions, documentDimensions) => {
    const documentWidth = documentDimensions.width;
    const documentHeight = documentDimensions.height;

    // If the "left" coordinate is outside the document, clamp it to the document width.
    const [left, widthShrinkAmount] = clampNumber(elementDimensions.left - documentDimensions.left, 0, documentWidth);

    // Reduce width optionally by the "withShrinkAmount" (if "left" is partially outside the document);
    // then the width can be maximally as big as "remaining" width of the document (when subtracting the left value)
    const [width] = clampNumber(elementDimensions.width - widthShrinkAmount, 0, documentWidth - left);

    // Height works the same as width.
    const [top, heightShrinkAmount] = clampNumber(elementDimensions.top - documentDimensions.top, 0, documentHeight);
    const [height] = clampNumber(elementDimensions.height - heightShrinkAmount, 0, documentHeight - top);

    return {
        top,
        left,
        width,
        height,
        // The "right" and Bottom" values are calculated; and are at most documentWidth or documentHeight.
        right: left + width,
        bottom: top + height,

        // the coordinates above are all measured from top-left corner of the document;
        // that means you cannot use it inside a "right" css property for instance (which
        // is measured from the right border instead).
        //
        // Because we need exactly this, we add an additional measurement; to be used
        // in CSS "right" alignments.
        rightAsMeasuredFromRightDocumentBorder: documentWidth - (left + width)

    };
};

//
// Get the absolute position of an element in the guest frame, clamped to
// width and height of the guest frame (i.e. so that it is fully visible).
//
export const getAbsolutePositionOfElementInGuestFrame = element => {
    if (element && element.getBoundingClientRect) {
        const relativeDocumentDimensions = getGuestFrameDocument().documentElement.getBoundingClientRect();
        const relativeElementDimensions = element.getBoundingClientRect();

        return clampElementToDocumentDimensions(relativeElementDimensions, relativeDocumentDimensions);
    }

    return {top: 0, left: 0, width: 0, height: 0};
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

//
// Dispatch custom event onto the document of the guest frame.
// Used for backwards compatibility with events from Ember UI
//
export const dispatchCustomEvent = (eventName, eventDescription, eventDetail = {}) => {
    const detail = {
        message: eventDescription,
        time: new Date(),
        ...eventDetail
    };
    const event = new CustomEvent(
        eventName,
        {
            detail,
            bubbles: true,
            cancelable: true
        }
    );
    getGuestFrameDocument().dispatchEvent(event);
};
