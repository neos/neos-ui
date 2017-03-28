//
// Helper functions for dom operations within the guest frame.
// Functions are curried, to enable lazy execution.
//

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
// Find a specific DOM node that represents a CR node in the guest frame
//
export const findNodeInGuestFrame = (contextPath, fusionPath) => fusionPath ? findInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"][data-__neos-fusion-path="${fusionPath}"]`
) : findInGuestFrame(
    `[data-__neos-node-contextpath="${contextPath}"]`
);

//
// Find the closest DOM node that represents a CR node relative to the given DOM node
// in the guest frame
//
export const closestNodeInGuestFrame = el => {
    if (!el) {
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
