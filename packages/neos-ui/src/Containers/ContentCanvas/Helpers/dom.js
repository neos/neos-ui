//
// Helper functions for dom operations within the guest frame.
// Functions are curried, to enable lazy execution.
//

export const iframeDocument = () => {
    return document.getElementsByName('neos-content-main')[0].contentDocument;
};
export const iframeWindow = () => {
    return document.getElementsByName('neos-content-main')[0].contentWindow;
};

export const find = selector => {
    return iframeDocument().querySelector(selector);
};

export const findAll = selector => {
    return [].slice.call(iframeDocument().querySelectorAll(selector));
};

export const body = () => iframeDocument().body;

export const findNode = (contextPath, fusionPath) => fusionPath ? find(
    `[data-__neos-node-contextpath="${contextPath}"][data-__neos-fusion-path="${fusionPath}"]`
) : find(
    `[data-__neos-node-contextpath="${contextPath}"]`
);

export const closestNode = el => {
    if (!el) {
        return null;
    }

    return el.dataset.__neosNodeContextpath ? el : closestNode(el.parentNode);
};

export const closestContextPath = el => {
    const dom = closestNode(el);

    if (!dom) {
        return null;
    }

    return dom.dataset.__neosNodeContextpath;
};
