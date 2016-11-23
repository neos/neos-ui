//
// Helper functions for dom operations within the guest frame.
// Functions are curried, to enable lazy execution.
//

export const find = selector => {
    //
    // TODO: workaround to access the frame from outside...
    //
    const iframeDocument = document.getElementsByName('neos-content-main')[0].contentDocument;

    return iframeDocument.querySelector(selector);
};

export const body = () => document.getElementsByName('neos-content-main')[0].contentDocument.body;

export const findNode = (contextPath, fusionPath) => find(
    `[data-__neos-node-contextpath="${contextPath}"][data-__neos-typoscript-path="${fusionPath}"]`
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
