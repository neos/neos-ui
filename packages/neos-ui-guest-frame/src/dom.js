//
// Helper functions for dom operations within the guest frame.
// Functions are curried, to enable lazy execution.
//
import animate from 'amator';

import style from './style.module.css';

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

/**
 * @typedef {Object} NodeInGuestFrame
 * @property {string} nodeAddress
 * @property {string} fusionPath
 * @property {Element} dataNode
 * @property {HTMLElement|null} contentDomNode
 * @property {Element} endNode
 */
const NODE_START_PREFIX = '__NEOS_UI_NODE_START__';
const NODE_END_PREFIX = '__NEOS_UI_NODE_END__';

/**
 * Find all DOM nodes that represent CR nodes in the guest frame
 * @return {Array<NodeInGuestFrame>}
 */
export const findAllNodesInGuestFrame = () => {
    return loadNodesFromComments();
}

/**
 *
 * @param {NodeInGuestFrame} nodeInGuestFrame
 * @return {Array<Node>}
 */
export const getDomNodesForNodeInGuestFrame = (nodeInGuestFrame) => {
    const {dataNode, nodeAddress} = nodeInGuestFrame;
    const nodesToRemove = [dataNode];
    let node = dataNode.nextSibling;
    while (node) {
        nodesToRemove.push(node);
        if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.indexOf(NODE_END_PREFIX + nodeAddress) === 0) {
            break;
        }
        node = node.nextSibling;
    }
    return nodesToRemove;
}

/**
 * Remove a DOM nodes that represent a CR node in the guest frame
 * @param {NodeInGuestFrame} nodeInGuestFrame
 * @return void
 */
export const removeNodeInGuestsFrame = (nodeInGuestFrame) => {
    getDomNodesForNodeInGuestFrame(nodeInGuestFrame).forEach(node => {
        node.parentNode.removeChild(node);
    });
}

/**
 * @param {string} filter
 * @param {Element} parentElement
 * @return {TreeWalker}
 */
const loadNodes = (filter, parentElement) => {
    const document = getGuestFrameDocument();
    return document.createTreeWalker(
        parentElement ? parentElement : document.getRootNode(),
        NodeFilter.SHOW_COMMENT,
        {
            acceptNode: (node) => node.nodeValue.indexOf(filter) === 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
        }
    );
}

/**
 * @param {Node} domNode
 * @return {NodeInGuestFrame|null}
 */
const parseNodeFromComment = (domNode) => {
    // The content dom node can be null if the node encapsulates other nodes without its own markup
    // TODO: They might still need some sort of rendering for highlighting, so we might need to create a helper dom element somewhere in the body
    // FIXME: Now there could be multiple nodes in the guest frame that are not encapsulated by a comment node
    // FIXME: Ignore comment nodes that are not part of the Neos UI
    let contentDomNode = domNode.nextSibling;
    if (contentDomNode.nodeType === Node.COMMENT_NODE) {
        contentDomNode = null;
    }
    let endNode = domNode.nextSibling;
    while (endNode) {
        if (endNode.nodeType === Node.COMMENT_NODE && endNode.nodeValue.indexOf(NODE_END_PREFIX) === 0) {
            break;
        }
        endNode = endNode.nextSibling;
    }

    return {
        ...JSON.parse(domNode.nodeValue.substring(NODE_START_PREFIX.length)),
        dataNode: domNode,
        contentDomNode,
        endNode,
    };
}

/**
 *
 * @param {string|null} nodeAddress
 * @param {string|null} fusionPath
 * @param {Element|null} parentElement
 * @return {Array<NodeInGuestFrame>}
 */
const loadNodesFromComments = (nodeAddress = null, fusionPath = null, parentElement = null) => {
    const nodeComments = loadNodes(NODE_START_PREFIX, parentElement);
    const nodes = [];
    while (nodeComments.nextNode()) {
        const {currentNode} = nodeComments;
        const nodeInGuestFrame = parseNodeFromComment(currentNode);
        if (!nodeInGuestFrame || (nodeAddress && nodeInGuestFrame.nodeAddress !== nodeAddress) || (fusionPath && nodeInGuestFrame.fusionPath !== fusionPath)) {
            continue;
        }
        nodes.push(nodeInGuestFrame);
    }
    return nodes;
}

//
// Find all DOM nodes that represent CR node properties in the guest frame
// TODO: Remove?
//
export const findAllPropertiesInGuestFrame = () => {
    return findAllInGuestFrame('[data-__neos-property]');
}

/**
 * Find all DOM nodes that represent a particular node property in the guest frame
 * @param {string} nodeAddress
 * @param {string} propertyName
 * @return {NodeInGuestFrame|null}
 */
export const findAllOccurrencesOfNodePropertyInGuestFrame = (nodeAddress, propertyName) => {
    findAllInGuestFrame(`[data-__neos-editable-node-contextpath="${CSS.escape(nodeAddress)}"][data-__neos-property="${CSS.escape(propertyName)}"]`);
};

/**
 * Find all DOM nodes that represent CR node properties in the guest frame
 * @param {NodeInGuestFrame} node
 * @return {Array<Element>}
 */
export const findRelativePropertiesInGuestFrame = (node) => {
    return [].slice.call(node.contentDomNode.querySelectorAll(
        `[data-__neos-property][data-__neos-editable-node-contextpath="${CSS.escape(node.nodeAddress)}"]`
    )).concat(...(
        node.contentDomNode.hasAttribute('data-__neos-property') ?
            [node.contentDomNode] : []
    ));
}

/**
 * Find a specific DOM node that represents a CR node in the guest frame
 * @param {string|null} nodeAddress
 * @param {string|null} fusionPath
 * @param {Element|null} parentElement
 * @return {NodeInGuestFrame|null}
 */
export const findNodeInGuestFrame = (nodeAddress = null, fusionPath = null, parentElement = null) => {
    const nodes = loadNodesFromComments(nodeAddress, fusionPath, parentElement);
    if (nodes.length > 0) {
        return nodes[0];
    }
    return null;
};

/**
 * Find all DOM nodes that represent a CR node identified by context path and
 * fusion path in the guest frame
 * @param {string} nodeAddress
 * @param {string} fusionPath
 * @return {Array<NodeInGuestFrame>}
 */
export const findAllOccurrencesOfNodeInGuestFrame = (nodeAddress, fusionPath) => {
    return loadNodesFromComments(nodeAddress, fusionPath);
};

/**
 * Find all rendered child nodes beneath a given DOM node
 * @param {Element} el
 * @return {Array<NodeInGuestFrame>}
 */
export const findAllChildNodes = (el) => {
    if (!el) {
        return [];
    }
    return loadNodesFromComments(null, null, el);
};

/**
 * Find the closest DOM node that represents a CR node relative to the given DOM node
 * in the guest frame
 * @param {Element} el
 * @return {NodeInGuestFrame|null}
 */
export const closestNodeInGuestFrame = (el) => {
    if (!el) {
        return null;
    }
    // Find nearest comment node that can be converted to a NodeInGuestFrame
    // FIXME: Ignore comment nodes that are not part of the Neos UI
    while (el && el.nodeType !== Node.COMMENT_NODE) {
        if (!el.previousSibling) {
            break;
        }
        el = el.previousSibling;
        if (el.nodeType === Node.COMMENT_NODE && el.nodeValue.indexOf(NODE_START_PREFIX) === 0) {
            return parseNodeFromComment(el);
        }
    }
    return closestNodeInGuestFrame(el.parentNode);
};

/**
 * Get the context path from the closest DOM node that represents a CR node relative to the
 * given DOM node in the guest frame
 * @param {Element} el
 * @return {string|null}
 */
export const closestContextPathInGuestFrame = el => {
    const nodeInGuestFrame = closestNodeInGuestFrame(el);

    if (!nodeInGuestFrame) {
        return null;
    }

    return nodeInGuestFrame.nodeAddress;
};

/**
 * Add hidden class to a DOM node that represents a CR node
 * @param {string} nodeAddress
 * @return {void}
 */
export const markNodeAsHidden = nodeAddress => {
    const domNode = findNodeInGuestFrame(nodeAddress);

    if (domNode) {
        domNode.contentDomNode.classList.add(style.markHiddenNodeAsHidden);
    }
};

/**
 * Remove hidden class from a DOM node that represents a CR node
 * @param {string} nodeAddress
 * @return {void}
 */
export const markNodeAsVisible = nodeAddress => {
    const domNode = findNodeInGuestFrame(nodeAddress);

    if (domNode) {
        domNode.contentDomNode.classList.remove(style.markHiddenNodeAsHidden);
    }
};

//
// Insert a placeholder element for content collections that don't have
// any children yet and have a very small height (as they would not be clickable / selectable otherwise).
// NOTE: If the element is "big enough" (i.e. more than 20 px), we do not render the placeholder either; as then
// the user will very likely have created his own rendering.
export const createEmptyContentCollectionPlaceholderIfMissing = collectionDomNode => {
    // FIXME: Adjust to NodeInGuestFrame
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
    if (element?.contentDomNode?.getBoundingClientRect) {
        const relativeDocumentDimensions = getGuestFrameDocument().documentElement.getBoundingClientRect();
        const relativeElementDimensions = element.contentDomNode.getBoundingClientRect();

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
